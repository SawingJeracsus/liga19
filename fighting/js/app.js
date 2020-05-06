class Game {
  constructor(fighters = [], gameconsole) {
    this.fighter1 = fighters[0];
    this.fighter2 = fighters[1];
    this.gameconsole = gameconsole;

    for(var atakID in this.fighter1.ataks){
      let atak = this.fighter1.ataks[atakID];
      atak.addTarget(this.fighter2, this.gameconsole);
    }

    for(var atakID in this.fighter2.ataks){
      let atak = this.fighter2.ataks[atakID];
      atak.addTarget(this.fighter1, this.gameconsole);
    }



  }
  isGameGoing = function () {
    if(this.fighter1.hpbar.hp <= 0){
      this.gameconsole.log(this.fighter2.name+' виграв(-ла)');
      return this.fighter2.name+' виграв(-ла)';
      this.end(this.fighter1.name+' виграв(-ла)');
    }else if (this.fighter2.hpbar.hp <= 0) {
      this.gameconsole.log(this.fighter1.name+' виграв(-ла)');
      return this.fighter1.name+' виграв(-ла)';
      this.end(this.fighter1.name+' виграв(-ла)');
    }else{
      return true;
    }
  }
  keyDownHandler(e){

    let key = e.key;

    for(var atakID in this.fighter1.ataks){
      let atak = this.fighter1.ataks[atakID];
      if(atak.key == key){
        atak.init(this.fighter2, this.gameconsole);
      }
    }
    for(var atakID in this.fighter2.ataks){
      let atak = this.fighter2.ataks[atakID];
      if(atak.key == key){
        atak.init(this.fighter1, this.gameconsole);
      }
    }
  }
  end = function (msg) {
    console.log(msg)
    $("#console").html('<h1>'+msg+'</h1>')
  }
}
class Fighter {
  constructor(name, hpbar, statusbar, ataks=[]) {
    this.name = name;
    this.hpbar = hpbar;
    this.statusbar = statusbar;
    this.ataks = ataks;
    for(let atakID in this.ataks){
      let atak = this.ataks[atakID];
      atak.setOwner(this);
    }
  }
  debuffAtak(debuff){
    for(let atakID in this.ataks){
      let atak = this.ataks[atakID];
      atak.incressDamege(debuff.debuff, debuff.delay);
    }
  }
  buffAtak(buff){
    for(let atakID in this.ataks){
      let atak = this.ataks[atakID];
      atak.incressDamege(-buff.buff, buff.delay);
    }
  }
  incressCouldown(buff){
    for(let atakID in this.ataks){
      let atak = this.ataks[atakID];
      atak.incressCouldown(buff.buff, buff.delay);
    }
  }
  addCouldown(debuff){
    for(let atakID in this.ataks){
      let atak = this.ataks[atakID];
      atak.incressCouldown(debuff.debuff, debuff.delay);
    }
  }
}
class HpBar {
  constructor(cnv, maxhp) {
    this.cnv = document.getElementById(cnv);
    this.cnv.height = 25;
    this.ctx = this.cnv.getContext('2d');
    this.hp = this.maxHP = this.maxHPReal = maxhp;

    this.render();
  }
  resiveDamage = function (damage) {

      let hpbar = this
      let intervalID = setInterval(function () {
        if(damage >= 0){
          hpbar.hp--
        }else{
          hpbar.hp++;
          clearInterval(intervalID);
        }
        damage--;
        hpbar.render();
      }, 1);
      this.render();

  }

  render = function () {
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);

    this.ctx.beginPath();
    this.ctx.fillStyle = "tomato";
    this.ctx.fillRect(0, 0, this.hp*(this.cnv.width/this.maxHP), this.cnv.height);

    this.ctx.font = "12px serif";
    this.ctx.fillStyle = "#000";
    this.ctx.fillText(this.hp+'/'+this.maxHP, 0, this.cnv.height);
  }
  heal = function (hp) {
    this.hp += hp;
    if(this.hp >= this.maxHP){
      this.hp = this.maxHP
    }
    this.render();
  }
  debuf(debuff){
    this.maxHP += debuff.debuff;
    if(this.maxHP <= this.hp){
      this.hp = this.maxHP;
    }
    this.render();
    let hpbar = this;
    setTimeout(function () {
      hpbar.maxHP = hpbar.maxHPReal;
      hpbar.render();
    }, debuff.delay * 1000);
  }
  buff(buff){
    this.maxHP += buff.buff;
    if(this.maxHPReal === this.hp){
      this.hp = this.maxHP;
    }
    this.render();
    let hpbar = this;
    setTimeout(function () {
      hpbar.maxHP = hpbar.maxHPReal;
      if(hpbar.maxHP <= hpbar.hp){
        hpbar.hp = hpbar.maxHP;
      }
      hpbar.render();
    }, buff.delay * 1000);
  }
}
class Atak {
  constructor(id, name, damage, couldown, key, config = { repyting: false, repytingDelay: 0 }) {
    this.el = document.getElementById(id);
    this.name = name;
    this.damage = this.damageReal = damage;
    this.couldown = this.couldownReal = couldown;
    this.oncouldown = false;
    this.key = key;
    this.config = config;
    if(key != null){
      this.el.append(" ["+key+"]");
    }
  }
  addTarget = function (fighter, gameconsole) {
    let dmg = this.damage;
    let atak = this;
    this.el.addEventListener('click', function (e) {
          atak.init(fighter, gameconsole);
      })
  }

  setOwner(owner){
    this.owner = owner;
  }
  init(fighter, gameconsole){
    let atak = this;
    if(!this.oncouldown){
      atak.oncouldown = true;
      atak.el.setAttribute("disabled", "disabled");
      if(atak.config.repyting === false){
        if(atak.damage >= 0){
          fighter.hpbar.resiveDamage(this.damage);
          gameconsole.logAtak(fighter.name, this);
        }else{
          gameconsole.logHeal(this.owner.name, this);
          atak.owner.hpbar.heal(-this.damage);
        }
      }else{
        if(this.damage >= 0){
          gameconsole.logAtak(fighter.name, atak);
          let i = 0;
          let id = setInterval(function(){
            if(i <= atak.config.repyting){
              fighter.hpbar.resiveDamage(atak.damage);
              i++;
            }else{
              clearInterval(id);
            }
          }, atak.config.repytingDelay*100)
        }else{
          gameconsole.logHeal(atak.owner.name, atak);
          let i = 1;
          let id = setInterval(function(){
            if(i <= atak.config.repyting){
              atak.owner.hpbar.heal(-atak.damage);
              i++;
            }else{
              clearInterval(id);
            }
          }, atak.config.repytingDelay*100)
        }
      }
      setTimeout(function () {
        atak.oncouldown = false;
        atak.el.removeAttribute("disabled");
      }, atak.couldown*1000)
    }
  }
  incressDamege = function(damageIncress, time){
    this.damage -= damageIncress;
    if(this.damage <= 0){
      this.damage = 0;
    }
    let atak = this;
    setTimeout(function(){
      atak.damage = atak.damageReal;
    }, time*1000)
  }
  incressCouldown = function(couldownIncress, time) {
    this.couldown = this.couldown*couldownIncress;
    if(this.couldown <= 0.1){
      this.couldown = 0.1;
    }
    let atak = this;
    setTimeout(function(){
      atak.couldown = atak.couldownReal;
    }, time*1000)
  }
}




class Debuff {
  constructor(id, name, key, couldown) {
    this.el = document.getElementById(id);
    this.name = name;
    this.key = key;
    this.couldown = couldown;
    this.oncouldown = false;
    if(key != null){
      this.el.append(" ["+key+"]");
    }
  }
  setOwner(owner){
    this.owner = owner;
  }
  addTarget(fighter, gameconsole){
    let debuff = this;
    this.el.addEventListener('click', function (e) {
          debuff.init(fighter, gameconsole);
      })
  }
  init(fighter, gameconsole){
    return false;
  }
  incressDamege(first, second){
    return false; // ця функція необхідна, бо формально дебаф це атака і всі функції атаки мають бути і в дебафа
  }
  incressCouldown(asd,asds){
    return false; // ця функція необхідна, бо формально дебаф це атака і всі функції атаки мають бути і в дебафа
  }
}

class AtakDebuff extends Debuff{
  constructor(id, name, key, couldown, debuff, delay) {
    super(id, name, key, couldown);
    this.slug = 'atakdebuff';
    this.debuff = debuff;
    this.delay = delay;
  }
  init(fighter, gameconsole){
    let debuff = this;
    if(!debuff.oncouldown){
      gameconsole.logDebuff(fighter.name, this);
      debuff.oncouldown = true;
      debuff.el.setAttribute('disabled', "disabled");
      fighter.debuffAtak(this);
      let statusID = fighter.statusbar.appendStatus(this.name, this.slug, "#fff", "#FFC107");
      setTimeout(function () {
        fighter.statusbar.removeStatus(statusID);
      }, debuff.delay*1000)
      setTimeout(function(){
        debuff.oncouldown = false;
        debuff.el.removeAttribute("disabled");
      }, this.couldown*1000)
    }
  }
}
class HpDebuff extends Debuff {
  constructor(id, name, key, couldown, debuff, delay) {
    super(id, name, key, couldown);
    this.slug = 'hpdebuff';
    this.debuff = debuff;
    this.delay = delay;
  }
  init(fighter, gameconsole){
    let debuff = this;
    if(!debuff.oncouldown){
      gameconsole.logDebuff(fighter.name, this);
      debuff.oncouldown = true;
      debuff.el.setAttribute('disabled', "disabled");
      fighter.hpbar.debuf(this);
      let statusID = fighter.statusbar.appendStatus(this.name, this.slug, "#fff", "#f00");
      setTimeout(function () {
        fighter.statusbar.removeStatus(statusID);
      }, debuff.delay*1000)
      setTimeout(function(){
        debuff.oncouldown = false;
        debuff.el.removeAttribute("disabled");
      }, this.couldown*1000)
    }
  }
}

class CouldownDebuff extends Debuff {
  constructor(id, name, key, couldown, debuff, delay) {
    super(id, name, key, couldown);
    this.slug = 'couldowndebuff';
    this.debuff = debuff;
    this.delay = delay;
  }
  init(fighter, gameconsole){
    let debuff = this;
    if(!debuff.oncouldown){
      gameconsole.logDebuff(fighter.name, this);
      debuff.oncouldown = true;
      debuff.el.setAttribute('disabled', "disabled");
      fighter.addCouldown(this);
      let statusID = fighter.statusbar.appendStatus(this.name, this.slug, "#fff", "#f00");
      setTimeout(function () {
        fighter.statusbar.removeStatus(statusID);
      }, debuff.delay*1000)
      setTimeout(function(){
        debuff.oncouldown = false;
        debuff.el.removeAttribute("disabled");
      }, this.couldown*1000)
    }
  }
}


class Buff extends Atak{
  constructor(id, name, key, couldown, buff, delay) {
    //id, name, damage, couldown, key, config = { repyting: false, repytingDelay: 0 }
    super(id, name , 0, couldown, key);
    this.buff = buff;
    this.delay = delay;
  }
}

class AtakBuff extends Buff{
  constructor(id, name, key, couldown, buff, delay) {
    super(id, name, key, couldown, buff, delay);
    this.slug = 'atakbuff';
  }
  init(fighter, gameconsole){

    let buff = this;
    if(!buff.oncouldown){
      gameconsole.logBuff(buff.owner.name, this);
      buff.oncouldown = true;
      buff.el.setAttribute('disabled', "disabled");
      buff.owner.buffAtak(this);
      let statusID = buff.owner.statusbar.appendStatus(this.name, this.slug, "#fff", "#FFC107");
      setTimeout(function () {
        buff.owner.statusbar.removeStatus(statusID);
      }, buff.delay*1000)
      setTimeout(function(){
        buff.oncouldown = false;
        buff.el.removeAttribute("disabled");
      }, this.couldown*1000)
    }

  }
}

class HpBuff extends Buff{
  constructor(id, name, key, couldown, buff, delay) {
    super(id, name, key, couldown, buff, delay);
    this.slug = 'hpbuff';
  }
  init(fighter, gameconsole){

    let buff = this;
    if(!buff.oncouldown){
      // gameconsole.logDebuff(fighter.name, this);
      buff.oncouldown = true;
      buff.el.setAttribute('disabled', "disabled");
      buff.owner.hpbar.buff(this);
      let statusID = buff.owner.statusbar.appendStatus(this.name, this.slug, "#fff", "#FFC107");
      setTimeout(function () {
        buff.owner.statusbar.removeStatus(statusID);
      }, buff.delay*1000)
      setTimeout(function(){
        buff.oncouldown = false;
        buff.el.removeAttribute("disabled");
      }, this.couldown*1000)
    }

  }
}
class CoulDownBuff extends Buff{
  constructor(id, name, key, couldown, buff, delay) {
    super(id, name, key, couldown, buff, delay);
    this.slug = 'couldownbuff';
  }
  init(fighter, gameconsole){

    let buff = this;
    if(!buff.oncouldown){
      // gameconsole.logDebuff(fighter.name, this);
      buff.oncouldown = true;
      buff.el.setAttribute('disabled', "disabled");
      buff.owner.incressCouldown(this);
      let statusID = buff.owner.statusbar.appendStatus(this.name, this.slug, "#fff", "#FFC107");
      setTimeout(function () {
        buff.owner.statusbar.removeStatus(statusID);
      }, buff.delay*1000)
      setTimeout(function(){
        buff.oncouldown = false;
        buff.el.removeAttribute("disabled");
      }, this.couldown*1000)
    }

  }
}

class GameConsole {
  constructor(id) {
    this.el = $('#'+id);
    this.data = null;
  }
  logAtak(name, atak){
    this.el.append('<p> На бійця '+name+' використовують: '+ atak.name + ' і наносять '+atak.damage+" урону");
  }
  logHeal(name, atak){
    this.el.append('<p> Боєць '+name+' використовує: '+ atak.name + ' і відновлює '+(-atak.damage)+'хп');
  }
  logDebuff(name, debuff){
    this.el.append('<p> На бійця '+name+' використвують : '+debuff.name);
  }
  logBuff(name, buff){
    this.el.append('<p> Боєць  '+name+' на себе використовує: '+buff.name+" !");
  }
  log(msg){
    this.el.append("<p>"+msg+"</p>")
  }
  updateData(){
      this.data = this.el.html();
  }
}

class StatusBar {
  constructor(el, prefix) {
    this.el = $("#"+el);
    this.counter = this.count = 0;
    this.prefix = prefix;
    this.statusArray = [];
  }
  appendStatus(name, slug, color = "#000", bgColor = "#fff"){
    this.counter++;
    this.count++;
    let id = this.counter+"_"+this.prefix;
    this.statusArray.push({
      id: id,
      name: name,
      slug: slug,
      color: color,
      bgColor: bgColor
    });

    this.el.append('<p class="status" id="'+id+'" style = "color: '+color+'; background-color: '+bgColor+'">'+name+'</p>');
    return id;
  }
  findBySlug(slug){
    let result = [];
    for(let statusID in this.statusArray){
      let status = this.statusArray[statusID];
      if(status.slug === slug){
        result.push(status);
      }
    }
    if(result.length === 0){
      return false;
    }else{
      return result;
    }
  }

  removeStatus(id){
    console.log(this.statusArray)
    for(let statusID in this.statusArray){
      let status = this.statusArray[statusID];
      if(status != null){
        if(status.id === id){
          this.statusArray[statusID] = null;
          $("#"+id).remove();
        }
      }
    }
    this.count--;
  }
}

document.addEventListener('keydown', function(e){
  // console.log(e);
  game.keyDownHandler(e);
})

var id = setInterval(function(){
  game.gameconsole.updateData();
  if(game.isGameGoing() != true){
    $('body').html("<div id='end'>"+game.isGameGoing()+"</br><p id='gameconsoleResult'>"+game.gameconsole.data+"</p></div>");
    clearInterval(id);
  }

}, 100)
