function resultsController(avatars, com) {
  "ngInject";
  this.avatars = avatars;
  this.com = com;
}

module.exports = {
  template: require('./results.html'),
  controller: resultsController
};

