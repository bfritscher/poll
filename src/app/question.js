var YAML = require('yamljs');

function questionController($http) {
  var $ctrl = this;

  $http.get('quiz/jointures.yml').then(function (res) {
    $ctrl.data = YAML.parse(res.data);
    $ctrl.setQuestion(0);
  });

  this.setAnswers = function () {
    this.votes = [
      2,
      2,
      1,
      4,
      1
    ];
  };

  this.votersTotal = 10;
  this.answer = [];

  this.toggleAnswer = function (answerIndex) {
    if (this.isResult()) {
      return;
    }
    if (this.questionIsMultiple()) {
      var i = this.answer.indexOf(answerIndex);
      if (i > -1) {
        this.answer.splice(i, 1);
      } else {
        this.answer.push(answerIndex);
      }
    } else {
      this.answer = [answerIndex];
    }
    // Todo send?
  };

  this.isResult = function () {
    return this.votes && this.votes.length > 0;
  };

  this.setQuestion = function (i) {
    if (!i) {
      i = this.data.questions.indexOf(this.question) + 1 % this.data.questions.length;
    }
    this.question = this.data.questions[i];
    this.answer = [];
    this.votes = [];
  };

  this.exists = function (key, list) {
    return list.indexOf(key) > -1;
  };

  this.questionIsMultiple = function () {
    if (!this.question) {
      return false;
    }
    var correctCount = this.question.answers.reduce(function (total, answer) {
      if (answer.correct) {
        total++;
      }
      return total;
    }, 0);
    return correctCount > 1;
  };
}

module.exports = {
  template: require('./question.html'),
  controller: questionController
};

