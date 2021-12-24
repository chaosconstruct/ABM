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
        this.particles.push(new Particle(ctx, initialValue));
      }
    },

    async animate() {
      const [canvas, ctx] = this.getContext();
      const particles = this.particles;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for(let i = 0 ; i < 1 ; i++) {
        //let tempval = await wrapUpdate(particles[i].x,particles[i].y,particles[i].vx,particles[i].vy,particles[i].ax,particles[i].ay,particles[i].dx,particles[i].dy);
        let tempval = await this.wrapUpdate(particles[i].x,particles[i].y,particles[i].vx,particles[i].vy,particles[i].ax,particles[i].ay,particles[i].dx,particles[i].dy);
        //// This is trial values //// needs to be updated once GUI is fixed. +ve and Int only.
        const val = [tempval[0],tempval[1],tempval[2],tempval[3],0,0,1,0];
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
