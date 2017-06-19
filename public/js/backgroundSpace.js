//Canvas size
let width = window.innerWidth;
let height = window.innerHeight;
let targetAmount = 40;
let dustParticles = [];
let ctx;

function updateSize(){
    width = window.innerWidth;
    height = window.innerHeight;
    console.log('Size updated');
};

//Now let's get the canvas and chance it's dimensions
function initBackground(){
    let canvas = document.getElementById('bgCanvas');
    canvas.width = width;
    canvas.height = height;
    //Now the 2d context
    ctx = canvas.getContext('2d');
    //Time for simple background and square for now
    ctx.fillStyle = '#070121';
    ctx.fillRect(0,0,width,height);
    initDust();
    drawDust();
}

function drawDust(){
    ctx.fillStyle = '#FFFFFF';
    for(let i = 0; i < dustParticles.length; i++){
        dustParticles[i].show();
    }
}

function dustParticle(){

    this.r = 10 + Math.random() *10;
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.show = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function initDust(){
    for(let i = 0; i < targetAmount; i++){
        dustParticles.push(new dustParticle);
    }
}