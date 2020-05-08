class Map {
  constructor(cnvID, mapSrc) {
    this.cnv = document.getElementById(cnvID);
    this.cnv.width = window.innerWidth;
    this.cnv.height = window.innerHeight;
    this.ctx = this.cnv.getContext('2d');


    this.mapImg = new Image();
    this.mapImg.src = mapSrc;

    this.render();
  }

  render(){
    this.ctx.fillStyle = "#131313";
    this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);

    this.ctx.drawImage(this.mapImg, (this.cnv.width-this.mapImg.width)/2, (this.cnv.height-this.mapImg.height)/2 )
  }

  moveHandler(e){
this.render();

    this.ctx.beginPath();
    this.ctx.arc(e.clientX, e.clientY, 10, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = '#eee';
    this.ctx.fill();
  }
}

var map = new Map('map', 'img/map.jpg');

document.addEventListener('mousemove', function (e) {
  map.moveHandler(e);
})
