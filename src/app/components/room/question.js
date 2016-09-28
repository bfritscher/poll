function questionController(com) {
  "ngInject";
  var $ctrl = this;
  $ctrl.com = com;

  this.answer = [];

  this.toggleAnswer = function (answerIndex) {
    if (this.isResult()) {
      return;
    }
    if (this.com.data.question.isMultiple) {
      var i = this.answer.indexOf(answerIndex);
      if (i > -1) {
        this.answer.splice(i, 1);
      } else {
        this.answer.push(answerIndex);
      }
    } else {
      this.answer = [answerIndex];
    }
    com.sendAnswer(this.answer);
  };

  this.isResult = function () {
    return com.data.question.votesByAnswers;
  };

  this.exists = function (key, list) {
    return list.indexOf(key) > -1;
  };
}

module.exports = {
  template: require('./question.html'),
  controller: questionController
};

