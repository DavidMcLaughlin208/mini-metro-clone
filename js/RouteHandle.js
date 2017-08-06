var RouteHandle = function(route){
  this.route = route;
  this.width = 15;
  this.height = 4;

  this.draw = function(x, y, rotation, station, ctx){
    ctx.moveTo(station.x, station.y);
    ctx.beginPath();
    ctx.lineTo(x,y);
    ctx.closePath()
  }
}
