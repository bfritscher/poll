function resultsController(avatars) {
  "ngInject";
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
}

module.exports = {
  template: require('./results.html'),
  controller: resultsController
};

