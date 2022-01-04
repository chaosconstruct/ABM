<script setup>
import { ref } from 'vue'
</script>

<template>
  <button @click="animate">Draw</button>
  <canvas id="canvas2"></canvas>
  <canvas id="canvas"></canvas>

</template>

<script>
import {Particle} from '../lib/particle.js';
import {getRandomIntInclusive} from '../lib/utils.js';
import { defaultProvider, stark } from 'starknet';
const { getSelectorFromName } = stark;
const CONTRACT_ADDRESS = "0x03fea20b3372f5f92503ce0fd98e7d8794d8ec43c3f468a9703c6868b937b593";

export default {
  name: 'Canvas',
  mounted() {
    this.initParticles();
  },
  data() {
    return {
      particles : []
    }
  },
  methods : {
    getContext() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext("2d");
      return [canvas, ctx];
    },

    async wrapUpdate(x, y, vx , vy, ax, ay, dx, dy){
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
    },

    initParticles() {
      const [canvas, ctx] = this.getContext();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let initialValue =  [canvas.width/2,canvas.height/2,0,0,0,0,0,0,0];
      for(let i = 0 ; i < 1 ; i++) {
        this.particles.push(new Particle(canvas, ctx, initialValue));
      }
    },

    async animate() {
      const [canvas, ctx] = this.getContext();
      const particles = this.particles;
      const FP = 10000;
      let PRIME = 3618502788666131213697322783095070105623107215331596699973092056135872020480;
      const PRIME_HALF = PRIME//2;
      let axx = 0.1;
      let ayy = 0;

      for(let i = 0 ; i < 1 ; i++) {

        let x = (particles[i].x >= 0) ? particles[i].x*FP : PRIME+(particles[i].x*FP);
        let y = (particles[i].y >= 0) ? particles[i].y*FP : PRIME+(particles[i].y*FP);
        let vx = (particles[i].vx >= 0) ? particles[i].vx*FP : PRIME+(particles[i].vx*FP);
        let vy = (particles[i].vy >= 0) ? particles[i].vy*FP : PRIME+(particles[i].vy*FP);
        let ax = (particles[i].ax >= 0) ? particles[i].ax*FP : PRIME+(particles[i].ax*FP);
        let ay = (particles[i].ay >= 0) ? particles[i].ay*FP : PRIME+(particles[i].ay*FP);
        let dx = (particles[i].dx >= 0) ? particles[i].dx*FP : PRIME+(particles[i].dx*FP);
        let dy = (particles[i].dy >= 0) ? particles[i].dy*FP : PRIME+(particles[i].dy*FP);


        let tempval = await this.wrapUpdate(x,y,vx,vy,ax,ay,dx,dy);


  
        dx = axx;
        dy = ayy;
      
        //// This is trial values //// needs to be updated once GUI is fixed. +ve and Int only.

        const val = [tempval[0]/FP,tempval[1]/FP,tempval[2]/FP,tempval[3]/FP,0,0,dx,dy];


        console.log(val);
        this.particles[i].update(val);
        this.particles[i].sanitizeBorders();
        this.particles[i].draw();
      }
      requestAnimationFrame(this.animate);
    }
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>

