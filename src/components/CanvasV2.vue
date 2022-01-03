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
const CONTRACT_ADDRESS = "0x0397fcd19dce25e0defc36deec07a37498d6ddfd741d8dabd787f1dfa36bb4b2";

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

    async wrapUpdate(x, y, vx , vy, ax, ay, dx, dy,FP){
      const value = await defaultProvider.callContract({
        contract_address: CONTRACT_ADDRESS,
        entry_point_selector: getSelectorFromName("getoutput"),
        calldata: [
          ""+Math.floor(x*FP),
          ""+Math.floor(y*FP),
          ""+Math.floor(vx*FP),
          ""+Math.floor(vy*FP),
          ""+Math.floor(ax*FP),
          ""+Math.floor(ay*FP),
          ""+Math.floor(dx*FP),
          ""+Math.floor(dy*FP)],
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
      const PRIME = 3618502788666131213697322783095070105623107215331596699973092056135872020481;
      const PRIME_HALF = PRIME//2;
      let axx = 0.1;
      let ayy = 0;

      for(let i = 0 ; i < 1 ; i++) {

        let tempval = await this.wrapUpdate(particles[i].x,particles[i].y,particles[i].vx,particles[i].vy,particles[i].ax,particles[i].ay,particles[i].dx,particles[i].dy,FP);
        //// This is trial values //// needs to be updated once GUI is fixed. +ve and Int only.

   //     let axx_v = (axx*FP >= 0) ? axx*FP : PRIME+(axx*FP);
   //     let ayy_v = (ayy*FP >= 0) ? ayy*FP : PRIME+(ayy*FP);
        
        const val = [tempval[0]/FP,tempval[1]/FP,tempval[2]/FP,tempval[3]/FP,0,0,axx/FP,ayy/FP];
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

