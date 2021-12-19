<script setup>
import { ref } from 'vue'
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="getPoolA()">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>

  <div id="canvas"></div>
</template>

<script>
import { defaultProvider, stark } from 'starknet';
const { getSelectorFromName } = stark;
import P5 from 'p5';

const CONTRACT_ADDRESS = "0x03e19baa6cb2078631bcdb34844f3f7879449a544c9ce722681a54af08cff4b9";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data : function() {
    return {
      count: 0
    }
  },
  methods : {
    async getPoolA() {
      const poolBalanceTokenA = await defaultProvider.callContract({
        contract_address: CONTRACT_ADDRESS,
        entry_point_selector: getSelectorFromName("get_pool_token_balance"),
        calldata: ["1"],
      });
      const balanceA = poolBalanceTokenA.result[0];
      console.log('token a liquidity pool balance: ', parseInt(balanceA, 16));
      let B = [];
      const script = p5 => {
        p5.setup = () => {
          p5.createCanvas(800, 800);
          for(let i = 0; i < 150;i++){
            B.push(new Boid(p5.createVector(p5.random(800), p5.random(800))));
          }
        };
        p5.draw = () => {
          p5.clear();
          p5.background(255);
          for (let i = 0; i < B.length; i++) {
            // Path following and separation are worked on in this function
            B[i].applyBehavior(B);
            // Call the generic run method (update, borders, display, etc.)
            B[i].update();
            B[i].borders();
            B[i].display();
          }
        };

        function Boid(position){
          this.location = position.copy();
          this.angle = p5.random(p5.TWO_PI);
          this.velocity = p5.createVector(p5.cos(this.angle), p5.sin(this.angle));
          this.acceleration = p5.createVector(0,0);
          this.maxspeed = 3;
          this.maxforce = 0.2;
          this.r = 12; //radius for seperation
        }

        Boid.prototype.update = function() {
          this.velocity.add(this.acceleration);
          this.velocity.limit(this.maxspeed);
          this.location.add(this.velocity);
          this.acceleration.mult(0);
        }

        Boid.prototype.applyforce = function(f){this.acceleration.add(f);}

        Boid.prototype.seek = function(target){
          let desired = p5.createVector(target).sub(this.location);
          desired.normalize();
          desired.mult(this.maxspeed);
          let steer = p5.createVector(desired).sub(this.velocity);
          steer.limit(this.maxforce);
          return steer;
        }

        Boid.prototype.seperation = function(b){
          let count = 0;
          let sum = p5.createVector();
          for (let i = 0; i < b.length; i++) {
            let d = p5.createVector(this.location).dist(b[i].location);
            if((d>0) && (d<this.r*2)){
              let diff = p5.createVector(this.location).dist(b[i].location);
              diff.normalize();
              diff.div(d);
              sum.add(diff);
              count++;
            }
          }

          if(count > 0){
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxspeed);
            sum.sub(this.velocity);
            sum.limit(this.maxforce);
          }
          return sum;
        }

        Boid.prototype.align = function(b){
          let count = 0;
          let dis = 50;
          let steer = p5.createVector(0,0);
          let sum = p5.createVector();
          for (let i = 0; i < b.length; i++) {
            let d = p5.createVector(this.location).dist(b[i].location);
            if((d>0) && (d<dis)){
              sum.add(b[i].velocity);
              count++;
            }
          }
          if(count > 0){
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxspeed);
            steer = p5.createVector(sum).sub(this.velocity);
            steer.limit(this.maxforce);
            return steer;
          }
          return steer;
        }


        Boid.prototype.cohesion = function(b){
          let count = 0;
          let dis = 50;
          let steer = p5.createVector(0,0);
          let sum = p5.createVector();
          for (let i = 0; i < b.length; i++) {
            let d = p5.createVector(this.location).dist(b[i].location);
            if((d>0) && (d<dis)){
              sum.add(b[i].location);
              
              count++;
            }
            
          }
          if(count > 0){
            sum.div(count);
            return this.seek(sum);
            
          }
            return steer;
          
        }



          
          Boid.prototype.applyBehavior = function(b){
            let seperating = this.seperation(b);
        //    PVector steering = seek(new PVector(mouseX,mouseY));
            let alignment = this.align(b);
            let cohesionf = this.cohesion(b);
            seperating.mult(1.5);
          //  steering.mult(1);
            alignment.mult(1);
            cohesionf.mult(1);
            this.applyforce(seperating);
        //   applyforce(steering);
            this.applyforce(alignment);
            this.applyforce(cohesionf);

          }


          Boid.prototype.display= function(b) {
            p5.fill(175);
            p5.stroke(0);
            p5.push();
            p5.translate(this.location.x, this.location.y);
            p5.ellipse(0, 0, this.r, this.r);
            p5.pop();
          }

        Boid.prototype.borders= function(b) {
            if (this.location.x < -this.r) this.location.x = 800+this.r;
            if (this.location.y < -this.r) this.location.y = 800+this.r;
            if (this.location.x > 800+this.r) this.location.x = -this.r;
            if (this.location.y > 800+this.r) this.location.y = -this.r;
          }
      }
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
