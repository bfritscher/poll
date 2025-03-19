function ShortcutController(com, $state, $scope) {
  "ngInject";
  this.handleKeyDown = function ($event) {
    if ($state.current.name === 'room') {
      if (com.data.user.isAdmin) {
        if ($event.keyCode === 76) { // l
          com.setState('lobby');
        }
        if ($event.keyCode === 82) { // r
          com.setState('results');
        }
        if ($event.keyCode === 37 || $event.keyCode === 33) { // leftArrow, pageUp
          com.previousState();
        }
        if ($event.keyCode === 39 || $event.keyCode === 34) { // rightArrow, pageDown
          com.nextState();
        }
        if ($event.keyCode === 190) { // .
          com.setState(com.data.room.state);
        }

            // state is room and admin pageup/down and arrows to switch questions l=lobby r=results
            // l = 76 r= 82 37 left 39 right pageup = 33 pagedown = 34 . = 190
      } else {
        // number to select answer 1-9 and keypad
        var index;
        if ($event.keyCode >= 49 && $event.keyCode <= 57) {
          index = $event.keyCode - 49;
          $scope.$broadcast('select-answer', index);
        }
        if ($event.keyCode >= 97 && $event.keyCode <= 105) {
          index = $event.keyCode - 97;
          $scope.$broadcast('select-answer', index);
        }
      }
    }
  };
}

module.exports = ShortcutController;
