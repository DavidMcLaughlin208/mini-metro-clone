var GameManager = function(){
  this.metro = new Canvas('metro', 900, 600);
  this.passengers = [];
  this.trains = [];
  this.stations = [];
  this.travelNodes = [];
  this.routes = {
    "red": new Route("#ff4444"),
    "blue": new Route("#4f83ff"),
    "orange": new Route("#ff8644"),
    "purple": new Route("#ff3feb")
  };
  this.colors = {
    "BACKGROUND": "#f2f6ff",
    "BLUE": "#4f83ff",
    "ORANGE": "#ff8644",
    "RED": "#ff4444",
    "PURPLE": "#ff3feb",
    "TEMPROUTE": "rgba(0, 0, 0, 0.5)"
  }

  this.clickBox = 40;

  this.connectingStation = null;
  this.connectingNode = null;
  this.connectingRoute = null;
  this.mouseX = 0;
  this.mouseY = 0;
  this.travelNodeIdCounter = 0;


  this.draw = function(){

    // Reset canvas and draw background
    this.metro.ctx.clearRect(-this.metro.width/2, -this.metro.height/2, this.metro.width, this.metro.height);

    this.metro.ctx.fillStyle = this.colors.BACKGROUND;
    this.metro.ctx.fillRect(-this.metro.width/2, -this.metro.height/2, this.metro.width, this.metro.height);

    for (var property in this.routes) {
      if (this.routes.hasOwnProperty(property)) {
        var route = this.routes[property];
        route.draw(this.metro.ctx, route.head);
      }
    }

    for (var property in this.routes) {
      if (this.routes.hasOwnProperty(property)) {
        var route = this.routes[property];
        route.drawHandle(route.head, route.headHandle, this.metro.ctx);
        route.drawHandle(route.tail(route.head), route.tailHandle, this.metro.ctx);
      }
    }

    if(this.connectingStation){
      this.drawTempRoute(this.metro.ctx)
    }

    for(var i in this.stations){
      this.stations[i].draw(this.metro.ctx);
      var passengers = this.stations[i].passengers;
      for(var j in passengers) {
        passengers[j].draw(this.metro.ctx, j);
      }
    }

    for(var i in this.trains){
      this.trains[i].draw(this.metro.ctx);
      var passengers = this.trains[i].passengers;
      for(var j in passengers){
        passengers[j].draw(this.metro.ctx, j);
      }
    }

  }

  this.drawTempRoute = function(ctx){
    ctx.strokeStyle = this.colors.TEMPROUTE;
    ctx.lineWidth = 20;

    ctx.beginPath();
    ctx.moveTo(this.connectingStation.x, this.connectingStation.y)
    ctx.lineTo(this.mouseX, this.mouseY);
    ctx.stroke();
    ctx.closePath();
  }

  this.isValidConnection = function(node, station){
    if(node.station === station){return false}
    if(node.next === null){return true}
    return this.isValidConnection(node.next, station)
  }

  this.headOrTail = function(station, route){
    if(station === route.head.station){
      return route.head;
    } else if (station === route.tail(route.head).station){
      return route.tail(route.head);
    }
    return null;
  }

  this.getTravelNodeId = function(){
    this.travelNodeIdCounter += 1;
    return this.travelNodeIdCounter;
  }

  this.getAllRouteHandles = function(){
    var routeHandles = [];
    for(var property in this.routes){
      if(this.routes.hasOwnProperty(property)){
        routeHandles.push(this.routes[property].headHandle);
        routeHandles.push(this.routes[property].tailHandle);
      }
    }
    return routeHandles;
  }
  this.allRouteHandles = this.getAllRouteHandles();
}
