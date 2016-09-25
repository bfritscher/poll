var YAML = require('yamljs');

function adminController(com, $stateParams, $scope, $window, $state) {
  "ngInject";
  this.com = com;
  var self = this;
  com.ready.then(function () {
    if (!com.data.user.isAdmin) {
      $state.go('home');
    }
  });
  com.joinRoom($stateParams.name);

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

