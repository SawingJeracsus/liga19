class Inventory {
  constructor(el) {
    this.el = document.getElementById(el);
    this.id = el;
    this.fields = [];
  }
  pushFieldsArray(field){
    this.fields.push(field);
  }
  up(el){
    for(let fieldID in this.fields){
      let field = this.fields[fieldID];
      if(el === field.el){
        $("#"+this.id).append(field.el);
        field.up();
      }
    }
  }
  move(e){
    for(let fieldID in this.fields){
      let field = this.fields[fieldID];
      if(field.isInUp === true){
        field.move(e);
      }
    }
  }
  down(e){
    for(let fieldID in this.fields){
      let field = this.fields[fieldID];
      if(field.isInUp === true){
        field.down(e);
      }
    }
  }
}
class Field{
  constructor(el){
    this.el = el;
    this.content = this.el.innerText;
    this.isInUp = false;
  }
  up(){
    this.isInUp = true;
    this.el.classList.add('draging');
  }
  move(e){
    let y = e.clientY - this.el.offsetWidth/2;
    let x = e.clientX - this.el.offsetHeight/2;
    this.el.setAttribute('style', 'top: '+y+'px; left: '+x+'px;');
  }
  down(e){
    this.isInUp = false;
    this.el.classList.remove('draging');
  }
}
var fields = document.getElementsByClassName("inventory__field");

var inventory = new Inventory('inventory');
for(let fieldID in fields){
  let field = fields[fieldID];
  if(typeof field == 'object')
  inventory.pushFieldsArray(new Field(field));
}
var mousedown = false;
document.addEventListener('mousedown', function (e) {
  e.preventDefault();
  mousedown = true;
  inventory.up(e.path[0]);
})
document.addEventListener('mouseup', function (e) {
  e.preventDefault();
  mousedown = false;
  inventory.down(e);
})
document.addEventListener('mousemove', function (e){
  if(mousedown){
    inventory.move(e);
  }
})
