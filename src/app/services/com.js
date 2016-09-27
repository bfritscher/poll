var Primus = require('../../lib/primus');

function Com($rootScope, $log, $state, $q) {
  "ngInject";
  var self = this;

  this.data = {
    online: false
  };

  var deferred = $q.defer();
  self.ready = deferred.promise;

  var primus = Primus.connect('http://localhost:3033');
  primus.on('open', function () {
    primus.on('data', function (data) {
      data = data || {};
      $log.debug(data);

      if (data.a === 'user') {
        self.data.user = data.user;
        deferred.resolve(primus);
      }

      if (data.a === 'rooms') {
        self.data.rooms = data.rooms;
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
        self.data.room = data.room;
      }

      if (data.a === 'close') {
        $state.go('home');
      }

      if (data.a === 'state') {
        self.data.room.state = data.v;
        // if question set q ? index? or get question?
      }

      if (data.a === 'voters') {
        self.data.room.voters = data.voters;
      }

      // question??

      // vote
      $rootScope.$digest();
    });

    $rootScope.$apply(function () {
      self.data.online = true;
    });
  });

  primus.on('reconnecting', function () {
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

Com.prototype.setState = function (state, option) {
  var self = this;
  this.ready.then(function (primus) {
    if (self.data.room && self.data.room.name) {
      primus.write({a: 'set_state', r: self.data.room.name, v: state, q: option});
    }
  });
};

module.exports = Com;
