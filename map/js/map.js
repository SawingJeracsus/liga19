class Map {
  constructor(points = []) {
    this.points = points;
  }
  up(e){
    for(let pointId in this.points){
      let point = this.points[pointId];
      if(point.el === e.path[0]){
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

  save(){
    let saveArray = [];
    for(let pointId in this.points){
      let point = this.points[pointId];
      saveArray.push(point.save());
    }
    return JSON.stringify(saveArray);
  }
}
class Point {
  constructor(el, id) {
    this.el = document.getElementById(el);
    this.id = id;
    this.moving = false;

    this.x = window.width/2;
    this.y = window.height/2;

  }
  up(e){
    this.moving = true;
  }
  move(e){
    let x = e.clientX - this.el.offsetWidth/2;
    let y = e.clientY - this.el.offsetHeight/2;

    this.x = x;
    this.y = y;

    this.el.setAttribute("style", 'top: '+y+'px; left: '+x+'px;');
  }

  down(e){
    this.moving = false;
  }

  save(){
    return {
      x: this.x,
      y: this.y,
      id: this.id,
    };
  }
}
var map = new Map([
  new Point('lubeshiv', 1),
  new Point('buchin', 2)
])

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
