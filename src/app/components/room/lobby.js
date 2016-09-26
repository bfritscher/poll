function lobbyController(com, avatars, $mdSidenav) {
  "ngInject";
  this.com = com;
  this.avatars = avatars;
  this.names = [
    'Karyl Batterton',
    'Adaline Combes',
    'Shanel Weingarten',
    'Wade Trainer',
    'Pasquale Prochnow',
    'Latanya Spevak',
    'Elise Domingues',
    'Noreen Perras',
    'Randi Buell',
    'Wiley Seger',
    'Latricia Halderman',
    'Khadijah Garriott',
    'Yolando Kierstead',
    'Griselda Gilmer',
    'Lashonda Oropeza',
    'Marlen Budzinski',
    'Elliott Ismail',
    'Palma Peaden',
    'Velia Mix',
    'Debra Beaton'
  ];

  this.toggleLeft = function () {
    $mdSidenav('left').toggle();
  };

  this.selectAvatar = function (i) {
    this.test = i;
    this.toggleLeft();
  };
}

module.exports = {
  template: require('./lobby.html'),
  controller: lobbyController
};

