var RouteHandle = function(route){
  this.route = route;
  this.width = 15;
  this.height = 4;

  this.draw = function(x, y, rotation, station, ctx){
    ctx.beginPath();
    ctx.moveTo(station.x, station.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(station.size/2, -station.size/2);
    ctx.lineTo(-station.size/2, station.size/2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.rotate(-rotation);
    ctx.translate(-x, -y);
  }
}
