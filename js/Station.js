var Station = function(x, y, color){
  this.x = x;
  this.y = y;
  this.color = color;
  this.connections = [];
  this.passengers = [];

  this.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  
}
