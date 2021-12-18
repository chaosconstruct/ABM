let B = [];

function setup() {
  createCanvas(800, 800);
  for(let i = 0; i < 150;i++){
    B.push(new Boid(createVector(random(width),random(height))))
}
}

function draw() {
  background(255);
  for (let i = 0; i < B.length; i++) {
    // Path following and separation are worked on in this function
    B[i].applyBehavior(B);
    // Call the generic run method (update, borders, display, etc.)
    B[i].update();
    B[i].borders();
    B[i].display();
  }
}


function Boid(position){
  this.location = position.copy();
  this.angle = random(TWO_PI);
  this.velocity = createVector(cos(this.angle), sin(this.angle));
  this.acceleration = createVector(0,0);
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


Boid.prototype.applyforce = function(f){

  this.acceleration.add(f);
  
}

Boid.prototype.seek = function(target){
  let desired = p5.Vector.sub(target,this.location);
  desired.normalize();
  desired.mult(this.maxspeed);
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);
  return steer;

}

Boid.prototype.seperation = function(b){
  let count = 0;
  let sum = createVector();
  for (let i = 0; i < b.length; i++) {
    let d = p5.Vector.dist(this.location,b[i].location);
    if((d>0) && (d<this.r*2)){
      let diff = p5.Vector.sub(this.location,b[i].location);
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
  let steer = createVector(0,0);
  let sum = createVector();
  for (let i = 0; i < b.length; i++) {
    let d = p5.Vector.dist(this.location,b[i].location);
    if((d>0) && (d<dis)){
      sum.add(b[i].velocity);
      
      count++;
    }
    
  }
  if(count > 0){
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    steer = p5.Vector.sub(sum,this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }
    return steer;
  
}


Boid.prototype.cohesion = function(b){
  let count = 0;
  let dis = 50;
  let steer = createVector(0,0);
  let sum = createVector();
  for (let i = 0; i < b.length; i++) {
    let d = p5.Vector.dist(this.location,b[i].location);
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
    fill(175);
    stroke(0);
    push();
    translate(this.location.x, this.location.y);
    ellipse(0, 0, this.r, this.r);
    pop();
  }

Boid.prototype.borders= function(b) {
    if (this.location.x < -this.r) this.location.x = width+this.r;
    if (this.location.y < -this.r) this.location.y = height+this.r;
    if (this.location.x > width+this.r) this.location.x = -this.r;
    if (this.location.y > height+this.r) this.location.y = -this.r;
  }
