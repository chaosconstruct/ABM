export class Particle{

    constructor(canvas, ctx, val) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = val[0];
        this.y = val[1];
        this.vx = val[2];
        this.vy = val[3];
        this.ax= val[4];
        this.ay= val[5];
        this.dx= val[6];
        this.dy= val[7];
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,15,0,Math.PI*2,false);
        this.ctx.fill();
        this.ctx.fillStyle = 'rgba(0, 0, 0)';
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

    sanitizeBorders() {
        if (this.x < -0) this.x = canvas.width;
        if (this.y < -0) this.y = canvas.height;
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) this.y = 0;
    }
}