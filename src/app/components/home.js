module.exports = {
  template: require('./home.html'),
  controller: function ($mdDialog, com) {
    "ngInject";
    this.com = com;

    this.addRoom = function (ev) {
      var name = $mdDialog.prompt()
        .title('Name of the new room?')
        .textContent('')
        .placeholder('Room name')
        .ariaLabel('Room name')
        .initialValue('Quiz')
        .targetEvent(ev)
        .ok('Next')
        .cancel('Cancel');

      $mdDialog.show(name).then(function (resultName) {
        var course = $mdDialog.prompt()
        .title('Name of the course?')
        .textContent('')
        .placeholder('Course name')
        .ariaLabel('Course name')
        .initialValue('SQL 1IG')
        .targetEvent(ev)
        .ok('Create')
        .cancel('Cancel');

        $mdDialog.show(course).then(function (resultCourse) {
          com.createRoom(resultName, resultCourse);
        });
      });
    };
  }
};
