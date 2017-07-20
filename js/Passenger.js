var Passenger = function(station, color){
  this.station = station;
  this.color = color;
  this.train = null;
  this.state = "station";
  this.size = 7;

  this.draw = function(ctx, index){
    switch(this.state) {
    case "station":
      ctx.beginPath();
      ctx.arc(this.calcX(index), this.calcY(index), this.size, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      break;
    case "train":

      break
    default:
      break;
    }
  }

  this.calcX = function(index){
    return this.station.x - this.station.size + index * this.size * 2;
  }
  this.calcY = function(index){
    // var multiplier = 1;
    // var rows = 1 + index;
    // while(rows > 4){
    //   rows -= 4;
    //   multiplier += 1;
    // }
    return this.station.y - this.station.size - this.size;
  }
}
