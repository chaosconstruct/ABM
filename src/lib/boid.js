export const script = p5 => {
    let B = [];
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
      if (count > 0){
        sum.div(count);
        return this.seek(sum);
      }
      return steer;
    }
      
    Boid.prototype.applyBehavior = function(b){
      let seperating = this.seperation(b);
      let alignment = this.align(b);
      let cohesionf = this.cohesion(b);
      seperating.mult(1.5);
      alignment.mult(1);
      cohesionf.mult(1);
      this.applyforce(seperating);
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