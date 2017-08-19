var GameManager = function(){
  this.metro = new Canvas('metro', 900, 600);
  this.passengers = [];
  this.passengersDelivered = 0;
  this.trains = [new Train(), new Train(), new Train()];
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
  this.shapes = [
    "circle",
    "square",
    "triangle",
    // "plus",
    // "teardrop",
    // "diamond"
  ];

  this.clickBox = 40;

  this.connectingStation = null;
  this.connectingNode = null;
  this.connectingRoute = null;
  this.connectingHandle = null;
  this.hoverStation = null;
  this.mouseX = 0;
  this.mouseY = 0;
  this.travelNodeIdCounter = 0;


  this.draw = function(){

    // Reset canvas and draw background
    this.metro.ctx.clearRect(-this.metro.width/2, -this.metro.height/2, this.metro.width, this.metro.height);

    this.metro.ctx.fillStyle = this.colors.BACKGROUND;
    this.metro.ctx.fillRect(-this.metro.width/2, -this.metro.height/2, this.metro.width, this.metro.height);

    // Draw routes
    for (var property in this.routes) {
      if (this.routes.hasOwnProperty(property)) {
        var route = this.routes[property];
        route.draw(this.metro.ctx, route.head);
      }
    }
    // Draw route handles
    for (var property in this.routes) {
      if (this.routes.hasOwnProperty(property)) {
        var route = this.routes[property];
        route.drawHandle(route.head, route.headHandle,
                         this.metro.ctx, this,
                         route.headHandle !== this.connectingHandle);
        route.drawHandle(route.tail(route.head), route.tailHandle,
                         this.metro.ctx, this,
                         route.tailHandle !== this.connectingHandle);
      }
    }
    // Draw route being drawn
    if(this.connectingStation){
      this.drawTempRoute(this.metro.ctx)
    }
    // Draw stations and passengers at stations
    for(var i in this.stations){
      this.stations[i].draw(this.metro.ctx);
      var passengers = this.stations[i].passengers;
      for(var j in passengers) {
        passengers[j].draw(this.metro.ctx, j);
      }
    }
    // Draw trains and passengers on trains
    for(var i in this.trains){
      this.passengersDelivered += this.trains[i].draw(this.metro.ctx);
      var passengers = this.trains[i].passengers;
      for(var j in passengers){
        passengers[j].draw(this.metro.ctx, j);
      }
    }

  }

  this.drawTempRoute = function(ctx){
    ctx.strokeStyle = this.connectingRoute.color;
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

  this.allPassengersUpdateItinerary = function(){
    for(var i = 0; i < this.stations.length; i++){
      var station = this.stations[i];
      for(var j = 0; j < station.passengers.length; j++){
        var passenger = station.passengers[j];
        passenger.getAndSetItinerary();
      }
    }
    for(var i = 0; i < this.trains.length; i++){
      var train = this.trains[i];
      for(var j = 0; j < train.passengers.length; j++){
        var passenger = train.passengers[j];
        passenger.getAndSetItinerary(train.target.station);
        if(passenger.itinerary[0] === train.route){
          passenger.itinerary.shift();
        } else {
          passenger.itinerary.unshift(train.target.station);
        }
      }
    }
  }

  this.spawnPasenger = function(){
    var station = this.stations[Math.floor(Math.random() * this.stations.length)];
    var shape = station.shape;
    while(shape === station.shape){
      shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    }
    station.passengers.unshift(new Passenger(station, shape));
  }
}
