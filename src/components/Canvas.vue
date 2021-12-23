<script setup>
import { ref } from 'vue'
</script>

<template>
  <button @click="draw">Draw</button>
  <div id="canvas"></div>
</template>

<script>
import { defaultProvider, stark } from 'starknet';
const { getSelectorFromName } = stark;
import {script} from '../lib/boid.js';
import P5 from 'p5';

const CONTRACT_ADDRESS = "0x03e19baa6cb2078631bcdb34844f3f7879449a544c9ce722681a54af08cff4b9";
export default {
  name: 'Canvas',
  methods : {
    async draw() {
      const p5canvas = new P5(script, 'canvas');
    }
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
