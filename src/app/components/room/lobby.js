function lobbyController(com) {
  "ngInject";
  this.com = com;
}

module.exports = {
  template: require('./lobby.html'),
  controller: lobbyController
};

