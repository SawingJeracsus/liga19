const EMPTY = 0;


class Inventory {
  constructor(id, fieldsArray) {
    this.id = id;
    this.el = $("#"+id);
    this.fields = fieldsArray;
  }
  pushItem(item){
    for(let fieldID in this.fields){
      let field = this.fields[fieldID];
      var success = false;
      if(!field.haveItem()){
        try {
          field.setItem(item);
          success = true;
        } catch (e) {
          console.error(e);
          return false;
          success = false;
        }
        field.item.setElement();
        return true;
      }else if (field.item.slug === item.slug) {
        try {
          field.setItem(item);
          success = true;
        } catch (e) {
          console.error(e);
          return false;
          success = false;
        }
        field.item.setElement();
        return true;
      }
    }
    if(!success){
      return false;
    }
  }
  up(e){
    for(let fieldID in this.fields){
      let field = this.fields[fieldID];
      if(field.el === e.path[0] || field.el === e.path[2]){
        if(field.haveItem()){
          field.up(e)
        }
      }
    }
  }
  move(e){
    for(let fieldID in this.fields){
      let field = this.fields[fieldID];
      if(field.moving){
        if(field.haveItem()){
          field.move(e);
        }
      }
    }
  }
  down(e){
    for(let fieldID in this.fields){
      let field = this.fields[fieldID];
      if(field.moving){
        let fieldBackup  = field;
        let count = field.count;
        let item = field.down(e);
        for(let fieldID in this.fields){
          let field = this.fields[fieldID];

          let parrent = document.elementFromPoint(e.pageX, e.pageY);
          if(parrent.parentElement != null){
            parrent = parrent.parentElement;
            if(parrent === null){
              parrent = false;
            }else{
              parrent = parrent.parentElement;
            }
          }else{
            parrent = false;
          }

          if(field.el === document.elementFromPoint(e.pageX, e.pageY) || field.el === parrent){
            var success = false;
              try {
                field.setItem(item, count);
                // field.setItem(item);
                // field.setCount(count);
                success = true;
              } catch (e) {
                // console.ereor(e);
                console.error(e);
                if(e == 'Items no same!'){
                  fieldBackup.setItem(item);
                  if(count >= fieldBackup.count){
                    fieldBackup.setCount(count);
                  }
                }
                return false;
                success = false;
              }
              return true;

          }
        }
        // Якщо не попало на жодне поле
        fieldBackup.setItem(item);
        if(count >= fieldBackup.count){
          fieldBackup.setCount(count);
        }
      }
    }
  }
  save(){
    let arrayForReturn = [];
    for(let fieldID in this.fields){
      let field = this.fields[fieldID];
      arrayForReturn.push(field.save());
    }
    return JSON.stringify(arrayForReturn);
  }
  restore(json){
    let arrayForRestore = JSON.parse(json);
    for(let fieldID in arrayForRestore){
      let field = this.fields[fieldID];
      let fieldData = arrayForRestore[fieldID];
      field.restore(fieldData)
    }
  }
}

class Field {
  constructor(el, item = null) {
    this.el = el;
    this.moving = false;
    this.item = item;
    this.count = 0;

  }
  haveItem(){
    if(this.item != null){
      return true;
    }else{
      return false;
    }
  }
  setItem(item, count = 1){
    if(typeof item === 'object'){
      if(this.haveItem()){
        let itemBackup = this.item;
        if(this.item.slug == item.slug){
          // console.log(item.slug);
          this.count += count;
          this.item = itemBackup;
        }else{
          throw 'Items no same!'
        }
      }else{
        this.count += count;
        this.item = item;
        // console.log(item);
        this.el.innerHTML = item.html;
      }
      this.updateCount();
    }else {
      throw 'Invalid type of item';
    }
  }
  clean(){
    this.el.innerHTML = '';
    let item = this.item;
    this.item = null;
    this.count = 0;
    return item;
  }
  update(){
    this.el.innerHTML = this.item.updateHtml();
  }
  setCount(count){
    this.count = count;
    this.updateCount();
  }
  updateCount(){
    this.el.innerHTML = this.item.html+'<p class="count">'+this.count+'</p>';
  }
  up(e){
    this.moving = true;
    this.item.setElement();
    this.item.el.classList.add('draging');
    this.move(e);
  }
  upHalf(e){
    alert('half');
  }
  move(e){
    let y = e.clientY - this.item.el.offsetWidth/2;
    let x = e.clientX - this.item.el.offsetHeight/2;
    this.item.el.setAttribute('style', 'top: '+y+'px; left: '+x+'px;');
  }
  down(e){
    this.moving = false;
    this.item.el.classList.remove('draging');
    let item = this.clean();
    return item;
  }
  save(){
    if (this.haveItem()) {
      return {
        id : this.item.id,
        img: this.item.img,
        slug: this.item.slug,
        maxCount: this.item.maxCount,
        html: this.el.innerHTML,
        count: this.count,
      }
    }else{
      return EMPTY;
    }
  }
  restore(array){
    if(array === EMPTY){
      this.clean()
    }else{
      this.item = new Item(array.id, array.slug, array.maxCount, array.img);
      this.count = array.count;
      this.updateCount();
    }
  }

}
class Item {
  constructor(id, slug, maxCount = 5, imgSrc) {
    this.id = id;
    this.img = imgSrc;
    this.slug = slug;
    this.html = "<p class='item' data-slug = '"+this.slug+"' id='"+this.slug+"-"+id+"'><img src = '"+imgSrc+"'></p>"
  }
  updateHtml(){
    this.html = "<p class='item' data-slug = '"+this.slug+"' id='"+this.slug+"-"+this.id+"'><img src = '"+this.img+"'></p>"
    return this.html;
  }
  setElement(){
    this.el = document.getElementById(this.slug+'-'+this.id);
    this.el.addEventListener('dblclick', function(e){
      alert('123');
      e.preventDefault();
    })
  }
}


fields =  document.getElementsByClassName("inventory__field");
fieldsArray = [];
for(let fieldID in fields){
  let field = fields[fieldID];
  if(typeof field == 'object')
  fieldsArray.push(new Field(field));
}
var inventory = new Inventory('inventory', fieldsArray);

var mousedown = false;
document.addEventListener('mousedown', function (e) {
  e.preventDefault();
  mousedown = true;
  switch (e.button) {
    case 0:
      inventory.up(e);
    break;
    case 2:
      inventory.upHalf(e);
    break;
  }
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


inventory.pushItem(new Item(1, 'poison', 5, 'img/poison.jpg'));
inventory.pushItem(new Item(2, 'poison', 5, 'img/poison.jpg'));
inventory.pushItem(new Item(3, 'poison', 5, 'img/poison.jpg'));
inventory.pushItem(new Item(4, 'poison', 5, 'img/poison.jpg'));

inventory.pushItem(new Item(1, 'apple', 5, 'img/apple.webp'));
inventory.pushItem(new Item(2, 'apple', 5, 'img/apple.webp'));
inventory.pushItem(new Item(3, 'apple', 5, 'img/apple.webp'));
inventory.pushItem(new Item(4, 'apple', 5, 'img/apple.webp'))
inventory.pushItem(new Item(5, 'apple', 5, 'img/apple.webp'))
inventory.pushItem(new Item(6, 'apple', 5, 'img/apple.webp'))
// inventory.restore("[{"id":1,"img":"img/poison.jpg","slug":"poison","html":"<p class=\"item\" data-slug=\"poison\" id=\"poison-1\"><img src=\"img/poison.jpg\"></p><p class=\"count\">4</p>","count":4},{"id":1,"img":"img/apple.webp","slug":"apple","html":"<p class=\"item\" data-slug=\"apple\" id=\"apple-1\"><img src=\"img/apple.webp\"></p><p class=\"count\">6</p>","count":6},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]");