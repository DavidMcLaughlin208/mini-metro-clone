var RouteHandle = function(route){
  this.x = null;
  this.y = null;
  this.route = route;
  this.width = 15;
  this.height = 4;

  this.draw = function(x, y, rotation, station, ctx){
    ctx.beginPath();
    ctx.moveTo(station.x, station.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(0, station.size/1.5);
    ctx.lineTo(0, -station.size/1.5);
    ctx.stroke();
    ctx.closePath();

    ctx.rotate(-rotation);
    ctx.translate(-x, -y);
  }
}
