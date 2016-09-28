function stateController(com) {
  "ngInject";
  this.com = com;
}

module.exports = {
  template: require('./roomToolbar.html'),
  controller: stateController
};
