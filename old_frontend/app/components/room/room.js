function roomController(com, $stateParams, $scope, $window) {
  "ngInject";
  this.com = com;
  com.joinRoom($stateParams.name);

  $scope.$on('$destroy', function () {
    com.leaveRoom();
  });

  $window.onbeforeunload = function () {
    com.leaveRoom();
  };
}

module.exports = {
  template: require('./room.html'),
  controller: roomController
};

