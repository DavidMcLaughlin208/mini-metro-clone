var RouteHandle = function(route, location){
  this.x = null;
  this.y = null;
  this.route = route;
  this.width = 15;
  this.height = 4;
  this.location = location;
  this.state = "node";

  this.getNode = function(){
    if(this.location === "head"){
      return this.route.head
    }else if(this.location === "tail"){
      return this.route.tail(this.route.head);
    }
  }

  this.draw = function(x, y, rotation, station, ctx, drawNode){
    if(true){
      this.x = x;
      this.y = y;
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
    } else {

    }
  }
}
