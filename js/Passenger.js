var Passenger = function(station, color){
  this.station = station;
  this.color = color;
  this.train = null;
  this.state = "station";

  this.draw = function(ctx){
    switch(this.state) {
    case: "station": 
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
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
}
