var Station = function(x, y, shape){
  this.x = x;
  this.y = y;
  this.shape = shape;
  this.size = 47;
  this.connections = [];
  this.passengers = [];

  this.draw = function(ctx){
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    switch(this.shape) {
      case "square":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "circle":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.size/1.7, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "triangle":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(0, -this.size/2);
        ctx.lineTo(this.size/1.7, this.size/2);
        ctx.lineTo(-this.size/1.7, this.size/2);
        ctx.lineTo(0, -this.size/2);
        ctx.lineTo(this.size/1.7, this.size/2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "diamond":
        ctx.translate(this.x, this.y);
        ctx.rotate(45*Math.PI/180);
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.rotate(-45*Math.PI/180);
        ctx.translate(-this.x, -this.y);
        break;
      case "plus":
        ctx.translate(this.x, this.y);
        ctx.lineWidth = 16;
        ctx.beginPath()
        ctx.rect(-this.size/6, -this.size/2, this.size/3, this.size);
        ctx.stroke();
        ctx.rect(-this.size/2, -this.size/6, this.size, this.size/3);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "teardrop":
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI);
        ctx.beginPath();
        ctx.arc(0, 0, this.size/1.7, Math.PI, false);
        ctx.moveTo(-this.size/1.7, 0);
        ctx.lineTo(0, this.size/1.7);
        ctx.lineTo(this.size/1.7, 0);
        ctx.fill();
        ctx.stroke();
        ctx.rotate(-Math.PI);
        ctx.translate(-this.x, -this.y);
        break;
      default:
        break;
    }
  }

}
