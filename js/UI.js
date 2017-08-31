var UI = function(size) {
  this.size = size;
  this.x = -200;
  this.y = -200;
  this.draw = function(ctx, passengerCount, ) {
    ctx.fillStyle = "black";
    ctx.font = size + "px serif"
    ctx.beginPath();
    ctx.fillText(passengerCount, this.x, this.y);
    ctx.closePath();
  }
}
