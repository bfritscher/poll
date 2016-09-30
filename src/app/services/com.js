var Primus = require('../../lib/primus');

function Com($rootScope, $log, $state, $q, $timeout) {
  "ngInject";
  var self = this;

  this.data = {
    online: false,
    answers: {}
  };

  var deferred = $q.defer();
  self.ready = deferred.promise;

  var primus = Primus.connect('https://marmix.ig.he-arc.ch', {strategy: 'online, timeout, disconnect'});
  primus.on('open', function () {
    primus.on('data', function (data) {
      data = data || {};
      $log.debug(data);

      if (data.a === 'user') {
        self.data.user = data.v;
        deferred.resolve(primus);
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
          if (index && (!self.data.answers.hasOwnProperty(index) || data.reset)) {
            self.data.answers[index] = [];
          }
        }
      }

      if (data.a === 'voter_join') {
        self.data.room.voters[data.v.email] = data.v;
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

    $rootScope.$apply(function () {
      self.data.online = true;
    });
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
  this.ready.then(function (primus) {
    primus.write({a: 'join', r: roomName});
  });
};

Com.prototype.leaveRoom = function () {
  var self = this;
  this.ready.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'leave', r: self.data.room.name});
    }
  });
};

Com.prototype.sendAnswer = function (answer) {
  var self = this;
  this.ready.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'vote', r: self.data.room.name, v: answer});
    }
  });
};

Com.prototype.setAvatar = function (avatar) {
  var self = this;
  this.ready.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'user_avatar', r: self.data.room.name, v: avatar});
    }
  });
};

Com.prototype.createRoom = function (roomName, courseName) {
  var self = this;
  this.ready.then(function (primus) {
    self.waitingOnRoom = roomName;
    primus.write({a: 'create_room', r: roomName, c: courseName});
  });
};

Com.prototype.closeRoom = function () {
  var self = this;
  this.ready.then(function (primus) {
    primus.write({a: 'close_room', r: self.data.room.name});
  });
};

Com.prototype.addQuestion = function (question) {
  var self = this;
  this.ready.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'add_question', r: self.data.room.name, q: question});
    }
  });
};

Com.prototype.setState = function (state) {
  var self = this;
  this.ready.then(function (primus) {
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

module.exports = Com;
