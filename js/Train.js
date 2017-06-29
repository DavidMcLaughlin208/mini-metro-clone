var Train = function(x, y){
  this.x = x;
  this.y = y;
  this.width = 30;
  this.height = 60;
  this.route = [];

  this.draw = function(ctx){
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'black';
    ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.fill();
    
    ctx.closePath();
    ctx.translate(-this.x, -this.y);
  }
}
