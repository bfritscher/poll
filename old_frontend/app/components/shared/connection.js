function connectionController(com) {
  "ngInject";
  this.com = com;
}

module.exports = {
  template: require('./connection.html'),
  controller: connectionController
};
