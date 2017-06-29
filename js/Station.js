var Station = function(x, y, color){
  this.x = x;
  this.y = y;
  this.color = color;
  this.connections = [];
  this.next = null;
  this.last = null;

  this.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

  }
  this.drawRoutes = function(ctx){
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 20;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.next.x, this.next.y);
    ctx.stroke();
    ctx.closePath();
  }
}
