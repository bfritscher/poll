function lobbyController(com, avatars, $mdSidenav) {
  "ngInject";
  var self = this;
  this.com = com;
  this.avatars = avatars;

  this.toggleLeft = function () {
    $mdSidenav('left').toggle();
  };

  this.selectAvatar = function (i) {
    com.setAvatar(this.avatars.icons[i]);
    this.toggleLeft();
  };

  this.voters = function () {
    return Object.keys(this.com.data.room.voters).map(function (key) {
      return self.com.data.room.voters[key];
    }).sort(this.com.userSorter);
  };
}

module.exports = {
  template: require('./lobby.html'),
  controller: lobbyController
};

