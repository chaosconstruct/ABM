<script setup>
import { ref } from 'vue'
</script>

<template>
  <button @click="draw">Draw</button>
  <canvas id="canvas2"></canvas>
  <canvas id="canvas"></canvas>

</template>

<script>
import { defaultProvider, stark } from 'starknet';
const { getSelectorFromName } = stark;
const CONTRACT_ADDRESS = "0x008f06975e029fb99f3eb7c593d88c3035094958a8725c28001c10bc2f657c9d";
export default {
  name: 'canvas',
  methods : {
    async draw() {

///// Warpping Contract call function  /////
async function wrapupdate(x1,y1,vx1,vy1,ax1,ay1,dx1,dy1){
    let x = "" + x1;
    let y = "" + y1;
    let vx = "" + vx1;
    let vy = "" + vy1;
   let ax = "" + ax1;
    let ay = "" + ay1;
    let dx = "" + dx1;
    let dy = "" + dy1;
    const value = await defaultProvider.callContract({
      contract_address: CONTRACT_ADDRESS,
      entry_point_selector: getSelectorFromName("getoutput"),
      calldata: [x,y,vx,vy,ax,ay,dx,dy],
    });


    return [parseInt(value.result[0], 16),parseInt(value.result[1], 16),parseInt(value.result[2], 16),parseInt(value.result[3], 16)];


    }



/////////////


/// Random number generator
function getRandomIntInclusive(max1) {
  let max = max1;
  let min = max1*-1;
  return Math.floor(Math.random() * (max - min+1) + min); //The maximum is inclusive and the minimum is inclusive
}


//// Particle system UI
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ParticleP = [];
let val =  [canvas.width/2,canvas.height/2,0,0,0,0,0,0,0];



class Particle{
    constructor(val){
    this.x = val[0];
    this.y = val[1];
    this.vx = val[2];
    this.vy = val[3];
    this.ax= val[4];
    this.ay= val[5];
    this.dx= val[6] ;
    this.dy= val[7];
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,15,0,Math.PI*2,false);

    ctx.fill();
    ctx.fillStyle = 'rgba(0, 0, 0)';
  }


  update(val2){


     this.x = val2[0];
    this.y = val2[1];
    this.vx = val2[2];
    this.vy = val2[3];
    this.ax = val2[4];
    this.ay = val2[5];
    this.dx = val2[6];
    this.dy = val2[7]

  }



  borders(){
  if (this.x < -0) this.x = canvas.width;
  if (this.y < -0) this.y = canvas.height;
  if (this.x > canvas.width) this.x = 0;
  if (this.y > canvas.height) this.y = 0;
  }
}


function init(){

//// Just 1 Particle right now
  for(let i = 0 ; i < 1 ; i++){

    ParticleP.push(new Particle(val));

  }
}



async function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0 ; i < 1 ; i++){


////// Major Issue here /////
let tempval = await wrapupdate(ParticleP[i].x,ParticleP[i].y,ParticleP[i].vx,ParticleP[i].vy,ParticleP[i].ax,ParticleP[i].ay,ParticleP[i].dx,ParticleP[i].dy);
val = [tempval[0],tempval[1],tempval[2],tempval[3],0,0,getRandomIntInclusive(1)*0.1,getRandomIntInclusive(1)*0.1]

    ParticleP[i].update(val);
    ParticleP[i].borders();
    ParticleP[i].draw();

    }

    requestAnimationFrame(animate);
}

init();
animate();




}

    }
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
