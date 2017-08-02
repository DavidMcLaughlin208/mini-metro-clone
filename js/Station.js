var Station = function(x, y, shape){
  this.x = x;
  this.y = y;
  this.shape = shape;
  this.size = 47;
  this.connections = [];
  this.passengers = [];

  this.draw = function(ctx){
    switch(this.shape) {
      case "square":
        ctx.translate(this.x, this.y);
        ctx.fillStyle = "white";
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.stroke();
        ctx.translate(-this.x, -this.y);
        break;
      case "triangle":
        ctx.lineWidth = 8;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size/2);
        ctx.lineTo(this.x + this.size/1.7, this.y + this.size/2);
        ctx.lineTo(this.x - this.size/1.7, this.y + this.size/2);
        ctx.lineTo(this.x, this.y - this.size/2);
        ctx.lineTo(this.x + this.size/1.7, this.y + this.size/2);
        ctx.fill();
        ctx.stroke();
        break;
      case "diamond":
        ctx.translate(this.x, this.y);
        ctx.rotate(45*Math.PI/180);
        ctx.fillStyle = "white";
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.stroke();
        ctx.rotate(-45*Math.PI/180);
        ctx.translate(-this.x, -this.y);
        break;
      case "plus":
        break;
      case "teardrop":
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI);
        ctx.beginPath();
        ctx.arc(0, 0, this.size/1.7, Math.PI, false);
        ctx.moveTo(-this.size/1.7, 0);
        ctx.lineTo(0, this.size/1.7);
        ctx.lineTo(this.size/1.7, 0);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();
        ctx.rotate(-Math.PI);
        ctx.translate(-this.x, -this.y);
        break;
      default:
        break;
    }
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    // ctx.fillStyle = this.color;
    // ctx.fill();
    // ctx.closePath();
  }

}
