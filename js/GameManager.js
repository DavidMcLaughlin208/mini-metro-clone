var GameManager = function(){
  this.metro = new Canvas('metro', 900, 600);
  this.sizeRatio = 1;
  this.passengers = [];
  this.passengersDelivered = 0;
  this.trains = [new Train(), new Train(), new Train(), new Train()];
  this.stations = [];
  this.travelNodes = [];
  this.scaledWidth = this.metro.mycanvas.width;
  this.scaledHeight = this.metro.mycanvas.height;
  this.sizes = {
    station: {size: 47, lineWidth: 8},
    passenger: {size: 12},
    train: {width: 80, height: 45, speed: 1},
    route: {width: 20}
  }
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
    "plus",
    "teardrop",
    "diamond"
  ];

  this.activeShapes = [
    "circle",
    "square",
    "triangle"
  ]

  this.clickBox = 40;

  this.connectingStation = null;
  this.connectingNode = null;
  this.connectingRoute = null;
  this.connectingHandle = null;
  this.hoverStation = null;
  this.mouseX = 0;
  this.mouseY = 0;
  this.travelNodeIdCounter = 0;

  this.sufficientDistance = 500;

  this.draw = function(){

    // Reset canvas and draw background
    this.metro.ctx.clearRect(-this.metro.width/2, -this.metro.height/2, this.metro.width, this.metro.height);

    this.metro.ctx.fillStyle = this.colors.BACKGROUND;
    this.metro.ctx.fillRect(-this.metro.width/2, -this.metro.height/2, this.metro.width, this.metro.height);

    this.zoomOut();
    // Draw routes
    for (var property in this.routes) {
      if (this.routes.hasOwnProperty(property)) {
        var route = this.routes[property];
        route.draw(this.metro.ctx, route.head, this.sizes);
      }
    }
    // Draw route handles
    for (var property in this.routes) {
      if (this.routes.hasOwnProperty(property)) {
        var route = this.routes[property];
        route.drawHandle(route.head, route.headHandle,
                         this.metro.ctx, this,
                         route.headHandle !== this.connectingHandle,
                         this.sizes);
        route.drawHandle(route.tail(route.head), route.tailHandle,
                         this.metro.ctx, this,
                         route.tailHandle !== this.connectingHandle,
                         this.sizes);
      }
    }
    // Draw route being drawn
    if(this.connectingStation){
      this.drawTempRoute(this.metro.ctx, this.sizes)
    }
    // Draw stations and passengers at stations
    for(var i in this.stations){
      this.stations[i].draw(this.metro.ctx, this.sizes);
      var passengers = this.stations[i].passengers;
      for(var j in passengers) {
        passengers[j].draw(this.metro.ctx, j, this.sizes);
      }
    }
    // Draw trains and passengers on trains
    for(var i in this.trains){
      this.passengersDelivered += this.trains[i].draw(this.metro.ctx, this.sizes);
      var passengers = this.trains[i].passengers;
      for(var j in passengers){
        passengers[j].draw(this.metro.ctx, j, this.sizes);
      }
    }

  }

  this.drawTempRoute = function(ctx){
    ctx.strokeStyle = this.connectingRoute.color;
    ctx.lineWidth = this.sizes.route.lineWidth;

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
      shape = this.activeShapes[Math.floor(Math.random() * this.activeShapes.length)];
    }
    station.passengers.unshift(new Passenger(station, shape, this.sizeRatio));
  }

  this.spawnStation = function(){
    var x = 0;
    var y = 0;
    var xModifier = 0;
    var yModifier = 0;
    var sufficientDistance = false;
    while(!sufficientDistance){
      sufficientDistance = true;
      xModifier = Math.random() * 100 + 10;
      yModifier = Math.random() * 100 + 10;
      Math.random() > 0.5 ? xModifier *= -1 : xModifier *= 1;
      Math.random() > 0.5 ? yModifier *= -1 : yModifier *= 1;
      x += xModifier;
      y += yModifier;
      for(var i in this.stations){
        var station = this.stations[i];
        var distanceX = Math.pow(station.x - x, 2);
        var distanceY = Math.pow(station.y - y, 2);
        var totalDistance = Math.sqrt(distanceX + distanceY);
        if(totalDistance < this.sufficientDistance){
          sufficientDistance = false;
        }
      }
    }
    var shape = this.activeShapes[Math.floor(Math.random() * this.activeShapes.length)];
    this.stations.push(new Station(x, y, shape, this.sizeRatio))
  }

  this.zoomOut = function() {
    var furthestX = 0;
    var furthestY = 0;
    for(var i in this.stations) {
      var station = this.stations[i];
      if(Math.abs(station.x) > furthestX) {
        furthestX = Math.abs(station.x);
      }
      if(Math.abs(station.y) > furthestY) {
        furthestY = Math.abs(station.y);
      }
    }
    furthestX += this.sizes.station.size * 2;
    furthestY += this.sizes.station.size * 2;

    var currentWidth = this.metro.mycanvas.width;
    var currentHeight = this.metro.mycanvas.height;

    var xRatio = 1;
    var yRatio = 1;
    if(furthestX > currentWidth/2){
      console.log("furthestX: ", furthestX);
      console.log("Current Width: ", currentWidth/2);
      xRatio = parseFloat(currentWidth/2)/parseFloat(furthestX);
    }
    if(furthestY > currentHeight/2) {
      console.log("furthestY: ", furthestY);
      console.log("Current Height: ", currentHeight);
      yRatio = parseFloat(currentHeight/2)/parseFloat(furthestY);
    }

    var newRatio = Math.min(xRatio, yRatio);
    if(xRatio < 1 || yRatio < 1){
      console.log("xRatio: ", xRatio);
      console.log("yRatio: ", yRatio);
    }
    if(newRatio < 1.0){
      this.sizeRatio *= newRatio;
      console.log("SizeRatio: ", this.sizeRatio)
      for(var station of this.stations) {
        station.x *= newRatio;
        station.y *= newRatio;
        for(var passenger of station.passengers) {
          passenger.x *= newRatio;
          passenger.y *= newRatio;
        }
      }
      for(var train of this.trains) {
        train.x *= newRatio;
        train.y *= newRatio;
        for(var passenger of train.passengers) {
          passenger.x *= newRatio;
          passenger.y *= newRatio;
        }
      }
      this.scaleAllInObject(this.sizes, newRatio);
      this.sufficientDistance *= newRatio;
      this.clickBox *= newRatio;
    }
  }

  this.scaleAllInObject = function(obj, newRatio) {
    for(var key of Object.keys(obj)) {
      if(key && obj[key].constructor === Object) {
        this.scaleAllInObject(obj[key], newRatio);
      } else {
        obj[key] *= newRatio;
      }
    }
  }
}
