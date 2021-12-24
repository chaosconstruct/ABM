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
const CONTRACT_ADDRESS = "0x0397fcd19dce25e0defc36deec07a37498d6ddfd741d8dabd787f1dfa36bb4b2";

export default {
  name: 'Canvas',
  methods : {
    async draw() {

      async function wrapUpdate(x, y, vx , vy, ax, ay, dx, dy){
        const poolBalanceTokenA = await defaultProvider.callContract({
          contract_address: "0x03e19baa6cb2078631bcdb34844f3f7879449a544c9ce722681a54af08cff4b9",
          entry_point_selector: getSelectorFromName("get_pool_token_balance"),
          calldata: ["1"],
        });

        
        const value = await defaultProvider.callContract({
          contract_address: CONTRACT_ADDRESS,
          entry_point_selector: getSelectorFromName("getoutput"),
          calldata: [
            ""+Math.floor(x),
            ""+Math.floor(y),
            ""+Math.floor(vx),
            ""+Math.floor(vy),
            ""+Math.floor(ax),
            ""+Math.floor(ay),
            ""+Math.floor(dx),
            ""+Math.floor(dy)],
        });
        return [parseInt(value.result[0], 16),parseInt(value.result[1], 16),parseInt(value.result[2], 16),parseInt(value.result[3], 16)];
      }

      /// Random number generator
      function getRandomIntInclusive(max1) {
        let max = max1;
        return Math.floor(Math.random() * (max+1) + 0); //The maximum is inclusive and the minimum is inclusive
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
        for(let i = 0 ; i < 1 ; i++) {
          ParticleP.push(new Particle(val));
        }
      }

      async function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for(let i = 0 ; i < 1 ; i++) {
          ////// Major Issue here /////
         //let tempval = await wrapUpdate(ParticleP[i].x,ParticleP[i].y,ParticleP[i].vx,ParticleP[i].vy,ParticleP[i].ax,ParticleP[i].ay,ParticleP[i].dx,ParticleP[i].dy);
         let tempval = await wrapUpdate(ParticleP[i].x,ParticleP[i].y,ParticleP[i].vx,ParticleP[i].vy,ParticleP[i].ax,ParticleP[i].ay,ParticleP[i].dx,ParticleP[i].dy);

         
         //// This is trial values //// needs to be updated once GUI is fixed. +ve and Int only.
         val = [tempval[0],tempval[1],tempval[2],tempval[3],0,0,1,0];
         console.log(val);
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
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
