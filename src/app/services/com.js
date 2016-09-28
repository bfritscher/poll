var Primus = require('../../lib/primus');

function Com($rootScope, $log, $state, $q) {
  "ngInject";
  var self = this;

  this.data = {
    online: false
  };

  var deferred = $q.defer();
  self.ready = deferred.promise;

  var primus = Primus.connect('http://localhost:3033', {strategy: 'online, timeout, disconnect'});
  primus.on('open', function () {
    primus.on('data', function (data) {
      data = data || {};
      $log.debug(data);

      if (data.a === 'user') {
        self.data.user = data.v;
        deferred.resolve(primus);
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
      }

      if (data.a === 'voters') {
        self.data.room.voters = data.v;
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

Com.prototype.createRoom = function (roomName) {
  var self = this;
  this.ready.then(function (primus) {
    self.waitingOnRoom = roomName;
    primus.write({a: 'create_room', r: roomName});
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
    if (self.data.room && self.data.room.name) {
      if (!state) {
        state = self.data.room.state;
      }
      primus.write({a: 'set_state', r: self.data.room.name, v: state});
    }
  });
};

Com.prototype.nextState = function () {
  if (this.data.room.state === 'lobby') {
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

module.exports = Com;
