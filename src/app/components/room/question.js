function questionController(com) {
  "ngInject";
  var $ctrl = this;
  $ctrl.com = com;

  this.toggleAnswer = function (answerIndex) {
    if (this.com.data.question.votesByAnswers) {
      return;
    }
    var answer = this.com.data.answers[this.com.questionIndex()];
    if (this.com.data.question.isMultiple) {
      var i = answer.indexOf(answerIndex);
      if (i > -1) {
        answer.splice(i, 1);
      } else {
        answer.push(answerIndex);
      }
    } else {
      answer = [answerIndex];
    }
    this.com.data.answers[this.com.questionIndex()] = answer;
    com.sendAnswer(answer);
  };

  this.exists = function (key) {
    if (this.com.data.answers.hasOwnProperty(this.com.questionIndex())) {
      return this.com.data.answers[this.com.questionIndex()].indexOf(key) > -1;
    }
    return false;
  };
}

module.exports = {
  template: require('./question.html'),
  controller: questionController
};

