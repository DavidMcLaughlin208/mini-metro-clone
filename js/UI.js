var UI = function(metro) {
  this.metro = metro;
  this.calcSize = function() {
    return this.metro.width/25;
  }

  this.calcX = function() {
    var width = this.metro.width/2;
    return width - this.size;
  }

  this.calcY = function() {
    var height = this.metro.height/2;
    return -height + this.size;
  }
  this.size = this.calcSize();
  this.x = this.calcX();
  this.y = this.calcY();
  this.draw = function(ctx, passengerCount) {
    ctx.fillStyle = "black";
    ctx.font = this.size + "px serif"
    ctx.beginPath();
    ctx.fillText(passengerCount, this.x, this.y);
    ctx.closePath();
  }
}
