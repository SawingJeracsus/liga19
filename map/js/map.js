class Map {
  constructor(points = [], wrapper, map, config) {
    this.points = points;
    this.wrapper = wrapper;
    this.addEl = document.getElementById(config.add);
    this.delet = document.getElementById(config.delet);

    this.addEl.addEventListener('click', ()=>{
      let text = prompt('Введіть назву:');
      this.addNew(text);
    })

    this.delet.addEventListener('click', ()=> {
      let text = prompt('Введіть назву для виталення:');
      if(confirm('Ви впевнені?')){
        console.log(this);
        this.delete(text)
      }
    })
    this.mapImg = document.getElementById(map);
    this.mapWidth = this.mapImg.offsetWidth;
    this.mapHeight = this.mapImg.offsetHeight;
    for(let pointId in this.points){
      let point = this.points[pointId];
      point.setWidthHeight(this.mapWidth, this.mapHeight)
    }
  }
  addNew(text){
    let wrapper = document.getElementsByClassName(this.wrapper)[0];

    wrapper.innerHTML = wrapper.innerHTML + `<button class="point" id="${this.points.length+1}">${text}</button>`;
    let id = this.points.push(new Point(this.points.length+1, this.points.length+1)) - 1;
    this.points[id].setWidthHeight(this.mapWidth, this.mapHeight);

    this.points[id].push({
      x: 20,
      y: 20,
    });
  }
  delete(text){
    let success = false;
    for(let pointId in this.points){
      let point = this.points[pointId];
      if(point.text === text){
        // console.log(point);
        point.el.remove();
        this.points[pointId] = null;
        success = true;
      }
    }
    if(!success){
      alert("Такого ще немає, щоб його ... ЗНИЩУВАТИ!!!");
    }
  }
  up(e){
    for(let pointId in this.points){
      let point = this.points[pointId];
      if(point.el.id === e.path[0].id){
        point.up(e);
      }
    }
  }
  move(e){
    for(let pointId in this.points){
      let point = this.points[pointId];
      if(point.moving){
        point.move(e);
      }
    }
  }
  down(e){
    for(let pointId in this.points){
      let point = this.points[pointId];
      if(point.moving){
        point.down(e);
      }
    }
  }

  windowchangeHandler(){
    for(let pointId in this.points){
      let point = this.points[pointId];
        point.windowchangeHandler();
    }
  }
  save(){
    let saveArray = [];
    for(let pointId in this.points){
      let point = this.points[pointId];
      try {
        saveArray.push(point.save());
      } catch (e) {
        console.log('Пусто...');
      }
    }
    return JSON.stringify(saveArray);
  }
  restore(json){
    try {
      var arrayRestoring = JSON.parse(json);
    } catch (e) {
      console.error(e);
      return false;
    }
    for(let pointId in this.points){
      let point = this.points[pointId];
      point.destroy();
    }
    // console.log(this.points);
    // console.log(arrayRestoring);
    let wrapper = document.getElementsByClassName(this.wrapper)[0];
    this.points = [];

    for(let pointID in arrayRestoring){
      let point = arrayRestoring[pointID];
      wrapper.innerHTML = wrapper.innerHTML + `<button class="point" id="${point.id}">${point.text}</button>`;
      let id = this.points.push(new Point(point.id, point.id)) - 1;
      this.points[id].setWidthHeight(this.mapWidth, this.mapHeight);
      this.points[id].restore(point);
    }

    return true;
  }
}
class Point {
  constructor(el, id) {
    this.el = document.getElementById(el);
    this.elID = el;
    this.text = this.el.innerHTML;
    this.id = id;
    this.moving = false;

    this.x = window.innerWidth/2;
    this.y = window.innerHeight/2;

  }
  rebindEL(){
      this.el = document.getElementById(this.elID);
  }
  setWidthHeight(w,h){
    this.width = w;
    this.height = h;
  }
  up(e){
    this.moving = true;
  }
  move(e){
    this.rebindEL();

    let x = e.clientX - this.el.offsetWidth/2;
    let y = e.clientY - this.el.offsetHeight/2;


    x  =   e.clientX - this.el.offsetWidth/2 - (window.innerWidth-this.width)/2;
    y  =   e.clientY - this.el.offsetHeight/2 - (window.innerHeight-this.height)/2;

    this.x = x / this.width ;
    this.y = y / this.height;

    this.el.setAttribute("style", 'top: '+y+'px; left: '+x+'px;');
  }

  windowchangeHandler(){
    this.rebindEL();

    let x = this.x * this.width ;//+ (window.innerWidth-this.width)/2;
    let y = this.y * this.height;// + (window.innerHeight-this.height)/2;

    this.el.setAttribute("style", 'top: '+y+'px; left: '+x+'px;');
  }
  down(e){
    this.moving = false;
    this.windowchangeHandler()
  }

  save(){
    return {
      x: this.x,
      y: this.y,
      text: this.text,
      id: this.id,
    };
  }
  restore(info){
    this.x = info.x;
    this.y = info.y;

    this.windowchangeHandler();
  }
  destroy(){
    this.el.remove();
  }
}
var map = new Map([], 'img', 'map',{
  add: 'add',
  delet: "delet"
})

var mousedown = false;
document.addEventListener('mousedown', function (e) {
  e.preventDefault();
  mousedown = true;
  switch (e.button) {
    case 0:
      map.up(e);
    break;
  }
})
document.addEventListener('mousemove', function (e){
    if(mousedown){
        map.move(e);
      }
    })
document.addEventListener('mouseup', function (e) {
  e.preventDefault();
  mousedown = false;
  map.down(e);
})
window.addEventListener('resize', () => {
  map.windowchangeHandler()
});

map.restore('[{"x":0.72890625,"y":0.03553921568627451,"text":"Любешів","id":1},{"x":0.40234375,"y":0.8909313725490197,"text":"Бучин","id":2},{"x":0.4046875,"y":0.0428921568627451,"text":"Заріка","id":3},{"x":0.19140625,"y":0.26838235294117646,"text":"Язівно","id":4}]')
