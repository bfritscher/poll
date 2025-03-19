function stateController(com, $state) {
  "ngInject";
  this.com = com;
  this.state = $state;

  this.votersCount = function () {
    if (this.com.data.room && this.com.data.room.voters) {
      return Object.keys(this.com.data.room.voters).length;
    }
    return 0;
  };
}

module.exports = {
  template: require('./roomToolbar.html'),
  controller: stateController
};
