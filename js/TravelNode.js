var TravelNode = function(){
  this.station = null;
  this.next = null;
  this.last = null;
  this.route = null;

  this.draw = function(ctx){

  }

  this.setStation = function(station){
    this.station = station;
    if(station.connections.indexOf(this) === -1){
      station.connections.push(this);
    }
  }

  this.drawRoutes = function(ctx, routes){
    for (var property in routes) {
      if (routes.hasOwnProperty(property)) {
        this.drawSingleRoute(ctx, routes[property].head);
      }
    }
  }

  this.drawSingleRoute = function(ctx, node){
    if(node.next !== null){
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 20;

      ctx.beginPath();
      ctx.moveTo(node.station.x, node.station.y)
      ctx.lineTo(node.next.station.x, node.next.station.y);
      ctx.stroke();
      ctx.closePath();

      this.drawSingleRoute(ctx, node.next)
    } else {
      return;
    }
  }
}
