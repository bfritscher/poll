module.exports = {
  template: require('./home.html'),
  controller: function ($mdDialog, com) {
    "ngInject";
    this.com = com;

    this.addRoom = function (ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
        .title('Name of the new room?')
        .textContent('')
        .placeholder('Room name')
        .ariaLabel('Room name')
        .initialValue('Quiz')
        .targetEvent(ev)
        .ok('Create')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function (result) {
        com.createRoom(result);
      });
    };
  }
};
