function Com($rootScope, $log, $state, $q, $timeout, $window, $mdDialog, $http) {
  "ngInject";
  var self = this;

  this.data = {
    online: false,
    answers: {}
  };

  self.tokenDeferred = $q.defer();

  this.getToken = function () {
    var jwt = localStorage.getItem('jwt');
    self.tokenDeferred = $q.defer();
    if (jwt) {
      self.token = jwt;
      self.tokenDeferred.resolve();
    } else {
      $window.location = 'https://marmix.ig.he-arc.ch/shibjwt/?reply_to=https://marmix.ig.he-arc.ch/poll/api/login';
    }
    return self.tokenDeferred.promise;
  };

  var deferred = $q.defer();
  self.ready = deferred.promise;
  var deferredUser = $q.defer();
  self.readyUser = deferredUser.promise;

  var primus = Primus.connect('https://marmix.ig.he-arc.ch', {strategy: 'online, timeout, disconnect'});
  primus.on('open', function () {
    // login
    self.login();

    $rootScope.$apply(function () {
      self.data.online = true;
    });
  });

  primus.on('data', function (data) {
    data = data || {};
    $log.debug(data);

    if (data.a === 'user') {
      deferredUser.resolve(primus);
      self.data.user = data.v;
    }

    if (data.a === 'error') {
      if (data.v.type === 'token') {
        self.deleteToken();
        self.login();
      }
    }

    if (data.a === 'user_avatar') {
      if (self.data.room && self.data.room.voters.hasOwnProperty(data.u)) {
        self.data.room.voters[data.u].avatar = data.v;
      }
    }

    if (data.a === 'user_answers') {
      self.data.answers = data.v;
    }

    if (data.a === 'rooms') {
      deferred.resolve(primus);
      self.data.rooms = data.v;
      if (self.waitingOnRoom && self.data.rooms.indexOf(self.waitingOnRoom) > -1) {
        $state.go('admin', {name: self.waitingOnRoom});
        delete self.waitingOnRoom;
        return;
      }
      if (self.data.rooms.length === 1 && $state.current.name === 'home') {
        $state.go('room', {name: self.data.rooms[0]});
      }
      if (self.data.room && self.data.rooms.indexOf(self.data.room.name) === -1) {
        $state.go('home');
      }
    }

    if (data.a === 'room') {
      self.data.room = data.v;
    }

    if (data.a === 'questions') {
      self.data.room.questions = data.v;
    }

    if (data.a === 'questionsCount') {
      self.data.room.questionsCount = data.v;
    }

    if (data.a === 'close') {
      $state.go('home');
    }

    if (data.a === 'state') {
      self.data.room.state = data.v;
      self.data.question = data.question;
      self.data.results = data.results;
      if (data.question && data.question.votesByAnswers) {
        var votesByAnswers = data.question.votesByAnswers;
        delete data.question.votesByAnswers;
        $timeout(function () {
          self.data.question.votesByAnswers = votesByAnswers;
        }, 100);
      } else {
        var index = self.questionIndex();
        if (angular.isDefined(index) && (!self.data.answers.hasOwnProperty(index) || data.reset)) {
          self.data.answers[index] = [];
        }
      }
    }

    if (data.a === 'voter_join') {
      self.data.room.voters[data.v.email] = data.v;
      if (!self.data.room.hasOwnProperty('participants')) {
        self.data.room.participants = {};
      }
      self.data.room.participants[data.v.email] = data.v;
    }

    if (data.a === 'voter_left') {
      delete self.data.room.voters[data.v];
    }

    if (data.a === 'votesCount') {
      self.data.question.votesCount = data.v;
    }

    if (data.a === 'vote') {
      self.data.room.questions[data.q].votes[data.u] = data.v;
    }
    // vote
    $rootScope.$digest();
  });

  primus.on('reconnect', function () {
    $rootScope.$apply(function () {
      self.data.online = false;
      deferred = $q.defer();
      self.ready = deferred.promise;
    });
  });

  this.userSorter = function (a, b) {
    var aname = a.lastname + a.firstname || '';
    var bname = b.lastname + b.firstname || '';
    if (aname > bname) {
      return 1;
    }
    if (aname < bname) {
      return -1;
    }
    return 0;
  };
}

Com.prototype.joinRoom = function (roomName) {
  this.readyUser.then(function (primus) {
    primus.write({a: 'join', r: roomName});
  });
};

Com.prototype.leaveRoom = function () {
  var self = this;
  this.readyUser.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'leave', r: self.data.room.name});
    }
  });
};

Com.prototype.sendAnswer = function (answer) {
  var self = this;
  this.readyUser.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'vote', r: self.data.room.name, v: answer});
    }
  });
};

Com.prototype.setAvatar = function (avatar) {
  var self = this;
  this.readyUser.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'user_avatar', r: self.data.room.name, v: avatar});
    }
  });
};

Com.prototype.createRoom = function (roomName, courseName) {
  var self = this;
  this.readyUser.then(function (primus) {
    self.waitingOnRoom = roomName;
    primus.write({a: 'create_room', r: roomName, c: courseName});
  });
};

Com.prototype.closeRoom = function () {
  var self = this;
  this.readyUser.then(function (primus) {
    primus.write({a: 'close_room', r: self.data.room.name});
  });
};

Com.prototype.addQuestion = function (question) {
  var self = this;
  this.readyUser.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'add_question', r: self.data.room.name, q: question});
    }
  });
};

Com.prototype.setState = function (state) {
  var self = this;
  this.readyUser.then(function (primus) {
    if (self.data.room && self.data.room.name && self.data.user.isAdmin) {
      if (state && state.hasOwnProperty('reset')) {
        primus.write({a: 'set_state', reset: true, r: self.data.room.name, v: self.data.room.state});
      } else {
        primus.write({a: 'set_state', r: self.data.room.name, v: state});
      }
    }
  });
};

Com.prototype.nextState = function () {
  if (this.data.room.state === 'lobby' || this.data.room.state === 'results') {
    if (this.data.room.questions.length > 0) {
      this.setState('q0');
    } else {
      this.setState('results');
    }
  }
  if (this.data.room.state.indexOf('q') === 0) {
    var currentIndex = parseInt(this.data.room.state.slice(1), 10);
    if (currentIndex < this.data.room.questions.length - 1) {
      this.setState('q' + (currentIndex + 1));
    } else {
      this.setState('results');
    }
  }
};

Com.prototype.previousState = function () {
  if (this.data.room.state === 'results') {
    if (this.data.room.questions.length > 0) {
      this.setState('q' + (this.data.room.questions.length - 1));
    } else {
      this.setState('lobby');
    }
  }
  if (this.data.room.state.indexOf('q') === 0) {
    var currentIndex = parseInt(this.data.room.state.slice(1), 10);
    if (currentIndex > 0) {
      this.setState('q' + (currentIndex - 1));
    } else {
      this.setState('lobby');
    }
  }
};

Com.prototype.questionIndex = function () {
  if (this.data.room && this.data.room.state.indexOf('q') === 0) {
    return parseInt(this.data.room.state.slice(1), 10);
  }
  return undefined;
};

Com.prototype.saveToken = function (token) {
  localStorage.setItem('jwt', token);
  this.token = token;
};

Com.prototype.deleteToken = function () {
  localStorage.removeItem('jwt');
  delete this.token;
};

Com.prototype.sendToken = function () {
  var self = this;
  this.ready.then(function (primus) {
    primus.write({a: 'token', v: self.token});
  });
};

Com.prototype.login = function () {
  var self = this;
  self.getToken().then(function () {
    self.sendToken();
  });
};

module.exports = Com;
