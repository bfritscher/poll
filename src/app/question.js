function questionController() {
  this.text = 'My brand new component!';
}

module.exports = {
  template: require('./question.html'),
  controller: questionController
};

