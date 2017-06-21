//Canvas size
let width = window.innerWidth;
let height = window.innerHeight;
let extraSpace = 20;
let targetAmount = 120;
let dustParticles = [];
let canvas,ctx;
let bgColor = '#070121';

//Variables for fps limiting
let targetFps = 28;
let targetTime = 1000 / targetFps;
let beginTime, spentTime;

function updateSize(){
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    console.log('Size updated');
};

//Now let's get the canvas and chance it's dimensions
function initBackground(){
    canvas = document.getElementById('bgCanvas');
    canvas.width = width;
    canvas.height = height;
    //Now the 2d context
    ctx = canvas.getContext('2d');
 //   ctx.globalCompositeOperation = "lighter";
    //Time for simple background and square for now
    initDust();
    mainAnimation();
}

function mainAnimation(){
    //Should we move this to another function?
    // ctx.fillStyle = bgColor;
    // ctx.fillRect(0,0,width,height);
    ctx.clearRect(0,0,width,height);
    updateParticles();
    drawDust();
    requestAnimationFrame(mainAnimation);
}

function updateParticles(){
    for(let i = 0; i < dustParticles.length; i++){
        dustParticles[i].update();
    }
}


function drawDust(){
  //  ctx.fillStyle =bgColor;
    for(let i = 0; i < dustParticles.length; i++){
        dustParticles[i].show();
    }
}

// Dust particle object
function dustParticle(){
    this.r = 2 + Math.random() *4;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.alpha = 0.7;
    this.change = 0.24;
    this.vector = {
        "x": Math.random() * 2 - 1,
        "y": Math.random() * 2 - 1
    }

    this.show = function(){
        ctx.save();
        this.gradient=ctx.createRadialGradient( this.x, this.y, this.r, this.x, this.y, 0 );
        this.gradient.addColorStop(1,'rgba(206, 231, 252, 0.54)');
        this.gradient.addColorStop(0,'rgba(206, 231, 252, 0.03)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.gradient;
        ctx.fill();
        ctx.restore();
    }


    this.update = function(){
        this.x += this.vector.x;
        this.y += this.vector.y;

        if(this.x < - extraSpace){
            this.x = width + extraSpace;
        }else if(this.x > width + extraSpace){
            this.x = -extraSpace;
        }

        if(this.y < -extraSpace){
            this.y = height + extraSpace;
        }else if(this.y > height + extraSpace){
            this.y = -extraSpace;
        }
    }
}


function initDust(){
    for(let i = 0; i < targetAmount; i++){
        dustParticles.push(new dustParticle);
    }
}