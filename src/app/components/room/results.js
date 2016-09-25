function resultsController() {
  "ngInject";
  this.text = 'My brand new component!';
}

module.exports = {
  template: require('./results.html'),
  controller: resultsController
};

