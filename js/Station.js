var Station = function(x, y, color){
  this.x = x;
  this.y = y;
  this.color = color;
  this.size = 30;
  this.connections = [];
  this.passengers = [];

  this.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  
}
