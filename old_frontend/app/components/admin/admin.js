var YAML = require('yamljs');

function adminController(com, $stateParams, $scope, $window, $state, avatars) {
  "ngInject";
  var self = this;
  self.avatars = avatars;
  self.com = com;
  self.question = {
    content: '',
    answersCount: 4
  };

  com.readyUser.then(function () {
    if (!com.data.user.isAdmin) {
      $state.go('home');
    }
  });
  com.joinRoom($stateParams.name);
  $scope.$watch('$ctrl.com.data.room.state', function () {
    if (com.data.room && com.data.room.state) {
      self.selectedTabIndex = com.data.room.state === 'lobby' ? 0 : 1;
    }
  });

  this.parseFiles = function (files) {
    delete self.importError;
    var reader = new FileReader();
    reader.readAsText(files[0], 'UTF-8');
    reader.onload = function (evt) {
      try {
        var yml = YAML.parse(evt.target.result);
        // NEXT question import selector?
        yml.questions.forEach(function (question) {
          com.addQuestion(question);
        });
      } catch (e) {
        self.importError = e;
      }
    };
    reader.onerror = function (evt) {
      self.importError = evt;
    };
  };

  /* colorvote */
  var colors = [
    '#5641de',
    '#ff3edd',
    '#ef1a2b',
    '#ff6825',
    '#F5D63D',
    '#7add6f',
    '#0dd1ff',
    '#c2e1f5'];

  this.addQuestion = function () {
    var question = {content: self.question.content, answers: []};
    for (var i = 0; i < self.question.answersCount; i++) {
      question.answers.push({content: '<div style="background-color: ' + colors[i] + ';margin: -8px -8px -8px -38px;text-align: center;line-height: 20px;padding: 20px;color: white;font-size: 30px;">' + i + '</div>'});
    }
    com.addQuestion(question);
  };

  // display voters
  this.votersWithoutAnswer = function () {
    var questionIndex = this.com.questionIndex();
    return Object.keys(this.com.data.room.voters).filter(function (userKey) {
      if (self.com.data.room.questions && self.com.data.room.questions[questionIndex] && self.com.data.room.questions[questionIndex].votes) {
        return !self.com.data.room.questions[questionIndex].votes.hasOwnProperty(userKey);
      }
      return true;
    }).map(function (userKey) {
      return self.com.data.room.voters[userKey];
    }).sort(this.com.userSorter);
  };

  $scope.$on('$destroy', function () {
    com.leaveRoom();
  });

  $window.onbeforeunload = function () {
    com.leaveRoom();
  };
}

module.exports = {
  template: require('./admin.html'),
  controller: adminController
};

