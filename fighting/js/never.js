class Game {
  constructor(config) {
    this.hpbar1 = document.getElementById(config.hpbar1).getContext('2d');
    this.hpbar2 = document.getElementById(config.hpbar2).getContext('2d');

    this.wCanvs1 = document.getElementById(config.hpbar1).width;
    this.hCanvs1 = document.getElementById(config.hpbar1).height;

    this.wCanvs2 = document.getElementById(config.hpbar2).width;
    this.hCanvs2 = document.getElementById(config.hpbar2).height;
    this.consoleEL = config.consoleEL;

    this.Hp1 = config.Hp1;
    this.Hp2 = config.Hp2;

    this.MaxHp1 = config.Hp1;
    this.MaxHp2 = config.Hp2;

    this.hero1Damage = 0;
    this.hero2Damage = 0;

    this.view1HP = this.wCanvs1 - this.hero1Damage*(this.wCanvs1/this.MaxHp1);
    this.view2HP = this.wCanvs2 - this.hero1Damage*(this.wCanvs2/this.MaxHp2);
    this.gameGoing = true;

  }
  reciveDamageByHero2 = function (damage) {
    this.hero2Damage += damage;
  }
  renderFrame = function () {
if(this.gameGoing){

      this.view1HP = this.wCanvs1 - this.hero1Damage*(this.wCanvs1/this.MaxHp1);
      this.view2HP = this.wCanvs2 - this.hero2Damage*(this.wCanvs2/this.MaxHp2);

      this.hpbar1.beginPath();
      this.hpbar1.fillStyle = "white";
      this.hpbar1.fillRect(0, 0, this.wCanvs1, this.hCanvs1);
      this.hpbar1.stroke();

      this.hpbar1.beginPath();
      this.hpbar1.fillStyle = "tomato";
      this.hpbar1.fillRect(0, 0, this.view1HP, this.hCanvs1);
      this.hpbar1.stroke();


      this.hpbar2.beginPath();
      this.hpbar2.fillStyle = "white";
      this.hpbar2.fillRect(0, 0, this.wCanvs2, this.hCanvs2);
      this.hpbar2.stroke();

      this.hpbar2.beginPath();
      this.hpbar2.fillStyle = "tomato";
      this.hpbar2.fillRect(0, 0, this.view2HP, this.hCanvs2);
      this.hpbar2.stroke();

  // this.consoleEL
      if(this.hero1Damage > 100){
        $(this.consoleEL).html("<h1>Гравець номер 2 переміг!</h1>");
        this.gameGoing = false;
      }

      if(this.hero2Damage > 100){
        $(this.consoleEL).html("<h1>Гравець номер 1 переміг!</h1>");
        this.gameGoing = false;
      }
}
  }
  init = function(speed) {
      setInterval(function(){game.renderFrame()}, speed);
  }

}
class Atak{
  constructor(el, damage, couldown, hero, game, consoleEL){
    this.selector = document.getElementById(el);
    consoleEL = $(consoleEL);
    this.damage = damage;
    this.hero = hero;
    this.timer = 0;
    this.couldown = couldown;
    this.selector.addEventListener('click', function () {
      if(game.gameGoing ){
        if(hero == 2){
            game.hero1Damage += damage;
            consoleEL.append("<p>Гравець Номер 2 наніс: "+damage+"</p>");
        }else{
            game.hero2Damage += damage;
            consoleEL.append("<p>Гравець Номер 1  наніс: "+damage+"</p>");
        }
        this.timer = this.couldown;
      }
    })


  }
}
var game = new Game({
  hpbar1: "hp_container1",
  hpbar2: "hp_container2",
  Hp1: 100,
  Hp2: 100,
  consoleEL: "#console"
})
ataks1 = [
            new Atak('dreamview', 30, 0.5, 1, game, "#console"),
            new Atak('musicatak', 20, 0.5, 1, game, "#console"),
            new Atak('hairpunch', 15, 0.5, 1, game, "#console")
         ];
ataks2 = [
            new Atak('scream', 80, 0.5, 2, game, "#console"),
            new Atak('pressing', 2, 0.5, 2, game, "#console"),
            new Atak('charge', 2, 0.5, 2, game, "#console")
         ];
 game.init(100);
