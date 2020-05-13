class CanvasDrawing {
    constructor(cnvel, config, instruments= {}) {
        this.cnv = document.getElementById(cnvel);
        this.ctx = this.cnv.getContext('2d');
        this.config = config;
        this.instruments = instruments;
        this.hand = {slug: null};

        this.mousemoving = false;
        document.addEventListener('mousedown', (e) => {
            this.mouseDownHandler(e);
            this.mousemoving = true;
        })

        document.addEventListener('mousemove', (e) => {
            if (this.mousemoving){
                this.mouseMoveHandler(e);
            }
        })

        document.addEventListener('mouseup', (e) => {
            this.mouseUpHandler(e);
            this.mousemoving = false;
        })

        this.setup();
    }
    setup(){
        this.cnv.width = this.cnv.parentElement.offsetWidth;
        this.cnv.height = this.cnv.parentElement.offsetHeight;

        this.drawGrid(this.config.numRows, this.config.numColls ? this.config.numColls: null);

        if(this.instruments.draw != undefined){
            this.instruments.draw.init = ()=>{this.setInstrumentInHand(this.instruments.draw)}
        }
        if(this.instruments.eraser != undefined){
            this.instruments.eraser.init = () => { this.setInstrumentInHand(this.instruments.eraser)}
        }
        if(this.instruments.palette != undefined){
            this.instruments.palette.init = () => { this.setColor()}
        }
    }

    setInstrumentInHand(instrument){
        if(this.hand.slug != null && this.hand != instrument){
            this.hand.removeSelect();
        }
        this.hand = instrument;
    }
    setColor(){

    }
    drawHorisontalLine(y){
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#c9c9c9';
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(0,y);
        this.ctx.lineTo(this.cnv.width, y);
        this.ctx.stroke();
    }

    drawVerticalLine(x){
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#c9c9c9';
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(x,0);
        this.ctx.lineTo(x, this.cnv.height);
        this.ctx.stroke();
    }

    drawGrid(numRows, numColls = null){
        if(numColls === null){
            numColls = numRows;
        }

        for (let i=1; i < numRows; i++){
            this.drawHorisontalLine((this.cnv.height/numRows)*i );
        }
        for (let i=1; i < numColls; i++){
            this.drawVerticalLine((this.cnv.width/numColls)*i );
        }

        this.rowCount = numRows;
        this.colCount = numColls;
    }
    getCordsByField(ex,ey){
        let x = ex - (window.innerWidth - this.cnv.width)/2;
        let y = ey - (window.innerHeight - this.cnv.height)/2;

        let fieldWidth = this.cnv.width / this.colCount;
        let fieldHeight = this.cnv.height / this.rowCount;

        let fieldCords = {
            x: Math.ceil(x / fieldWidth ),
            y: Math.ceil(y / fieldHeight ) + 1,
        }

        return fieldCords;
    }
    drawFieldByCords(x, y, color = '#000'){
        this.ctx.fillStyle = '#c9c9c9';
        this.ctx.fillRect((x-1)*(this.cnv.width / this.colCount), (y-1)*(this.cnv.height / this.rowCount), this.cnv.width / this.colCount, this.cnv.height / this.rowCount)
        this.ctx.fillStyle = color;
        this.ctx.fillRect((x-1)*(this.cnv.width / this.colCount)+1, (y-1)*(this.cnv.height / this.rowCount)+1, this.cnv.width / this.colCount-1, this.cnv.height / this.rowCount-1)
    }
    mouseDownHandler(e){
        if(this.hand.slug === 'draw'){
            if(e.path[0] === this.cnv){
                let cords = this.getCordsByField(e.clientX, e.clientY);
                this.drawFieldByCords(cords.x, cords.y);
            }
        }
        if(this.hand.slug === 'eraser'){
            if(e.path[0] === this.cnv){
                let cords = this.getCordsByField(e.clientX, e.clientY);
                this.drawFieldByCords(cords.x, cords.y, '#fff');
            }
        }

    }
    mouseMoveHandler(e){
        if(this.hand.slug === 'draw'){
            if(e.path[0] === this.cnv){
                let cords = this.getCordsByField(e.clientX, e.clientY);
                this.drawFieldByCords(cords.x, cords.y);
            }
        }
        if(this.hand.slug === 'eraser'){
            if(e.path[0] === this.cnv){
                let cords = this.getCordsByField(e.clientX, e.clientY);
                this.drawFieldByCords(cords.x, cords.y, '#fff');
            }
        }
    }
    mouseUpHandler(e){

    }
}

class Instrument {
    constructor(el, slug) {
        this.el = document.getElementById(el);
        this.slug = slug;

        this.setListener();
    }
    init = ()=>{
        return null;
    }
    select(){
        this.el.classList.add('active');
    }
    removeSelect(){
        this.el.classList.remove('active');
    }
    setListener(){
        this.el.addEventListener('click', (e) => {
            e.preventDefault();
            this.select();
            this.init();
        })
    }
}

class Palette {
    constructor(el) {
        this.el = document.getElementById(el);
        this.colors = [];
        this.count = 0;
    }
    show(){
        this.el.setAttribute('style', `visibility: visible;`)
    }
    hide(){
        try {
            this.el.removeAttribute('style');
        }catch (e) {
            console.erorr('Ellement is allready hidden');
        }
    }
    addColor(color){
        this.count++;
        this.el.innerHTML = this.el.innerHTML + `<span class="color" id="color-${this.count}" style="background-color: ${color};">1</span>`
        this.colors.push({
            color: color,
            amount: 1,
            id: 'color-'+this.count
        })

        return 'color-'+this.count;
    }
    addAmount(id, amount){
        for (let colorID in this.colors){
            let color = this.colors[colorID];
            if(color != null){
                if(color.id === id){
                    color.amount += amount;
                    this.colors[colorID] = color;

                    let el = document.getElementById(color.id);
                    el.innerHTML = color.amount;
                }
            }
        }
    }
    removeColor(id){
        for (let colorID in this.colors){
            let color = this.colors[colorID];
            if(color != null){
                if(color.id === id){
                    let el = document.getElementById(color.id);
                    el.remove();

                    this.colors[colorID] = null;
                }
            }
        }
    }
}
var canvas = new CanvasDrawing('canvas', {
    numRows: 20,
}, {
    draw: new Instrument('draw', 'draw'),
    eraser: new Instrument('eraser', 'eraser'),
    palette: new Instrument('palette', 'palette'),
    palette_container: new Palette('palette_container')
});