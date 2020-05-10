class Map {
  constructor(points = [], wrapper) {
    this.points = points;
    this.wrapper = wrapper;
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
      saveArray.push(point.save());
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
    // console.log(arrayRestoring);
    let wrapper = document.getElementsByClassName(this.wrapper)[0];
    this.points = [];

    for(let pointID in arrayRestoring){
      let point = arrayRestoring[pointID];
      wrapper.innerHTML = wrapper.innerHTML + `<button class="point" id="${point.id}">${point.text}</button>`;
      let id = this.points.push(new Point(point.id, point.id)) - 1;
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
  up(e){
    this.moving = true;
  }
  move(e){
    this.rebindEL();

    let x = e.clientX - this.el.offsetWidth/2;
    let y = e.clientY - this.el.offsetHeight/2;

    this.x = x / window.innerWidth;
    this.y = y / window.innerHeight;

    this.el.setAttribute("style", 'top: '+y+'px; left: '+x+'px;');
  }

  windowchangeHandler(){
    this.rebindEL();

    let x = this.x * window.innerWidth;
    let y = this.y * window.innerHeight;

    this.el.setAttribute("style", 'top: '+y+'px; left: '+x+'px;');
  }
  down(e){
    this.moving = false;
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
var map = new Map([
  new Point('lubeshiv', 1),
  new Point('buchin', 2),
  new Point('zarika', 3)
], 'map_wrapper')

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

map.restore('[{"x":0.21693907875185736,"y":0.3496,"text":"Любешів","id":1},{"x":0.3514115898959881,"y":0.7944,"text":"Бучин","id":2},{"x":0.40936106983655274,"y":0.1832,"text":"Заріка","id":3}]')
