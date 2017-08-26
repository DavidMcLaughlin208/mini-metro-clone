var Train = function(){
  this.x = null;
  this.y = null;
  this.width = 60;
  this.height = 30;
  this.route = null;
  this.travelNode = null;
  this.state = "travel";
  this.forward = true;
  this.passengers = [];
  this.rotation = 90;
  this.target = null;

  this.setParams = function(x, y, route, travelNode){
    this.x = x;
    this.y = y;
    this.route = route;
    this.travelNode = travelNode;
  }

  this.clearParams = function(){
    this.x = null;
    this.y = null;
    this.route = null;
    this.travelNode = null;
    this.target = null;
    this.forward = true;
  }

  this.allPassengersUpdateItinerary = function(){
    for(var i in this.passengers){
      var passenger = this.passengers[i];
      passenger.getAndSetItinerary(this.target.station);
    }
  }

  this.draw = function(ctx){
    if(this.x === null || this.y === null || this.travelNode === null || this.route === null){return 0;}
    var passengersDeliveredCount = 0;
    if(!this.target && this.forward){
      this.target = this.travelNode.next;
    } else if(!this.target && !this.forward) {
      this.target = this.travelNode.last;
    }
    var remainingDistanceX = this.x - this.target.station.x
    var remainingDistanceY = this.y - this.target.station.y
    var remainingdistance = Math.sqrt(Math.pow(remainingDistanceX, 2) + Math.pow(remainingDistanceY, 2));
    if(remainingdistance <= 1){
      this.state = "dock";
    }

    switch(this.state) {
      case "travel":
        var distanceX = Math.pow(this.travelNode.x - this.target.x, 2);
        var distanceY = Math.pow(this.travelNode.y - this.target.y, 2);
        var totalDistance = Math.sqrt(distanceX + distanceY);

        var normalizeFactor = Math.max(Math.max(Math.abs(remainingDistanceX), 1), Math.max(Math.abs(remainingDistanceY), 1));
        var normalizedX = (remainingDistanceX/normalizeFactor) * 0.4;
        var normalizedY = (remainingDistanceY/normalizeFactor) * 0.4;
        var lastX = this.x;
        var lastY = this.y;

        this.x -= normalizedX;
        this.y -= normalizedY;

        var slope = (this.y - lastY) / (this.x - lastX);
        this.rotation = Math.atan(slope);

        break;
      case "dock":
        for(var i = this.passengers.length - 1; i >= 0; i--){
          var passenger = this.passengers[i];
          if(passenger.itinerary[0] === this.target.station){
            console.log("disembarking")
            if(passenger.shape === this.target.station.shape){
              passengersDeliveredCount += 1;
            }
            passenger.disembark(this, this.target.station, i);
          }
        }
        if(!this.target.next && !this.target.last){
          var toTerminal = true;
          for(var i in this.target.station.connections){
            var node = this.target.station.connections[i];
            if(node.route === this.route){
              this.target = node;
              if(this.target.next){
                this.travelNode = this.target.next;
                this.forward = false;
              } else if(this.target.last){
                this.travelNode = this.target.last;
                this.forward = true;
              } else {
                continue;
              }
              toTerminal = false;
              this.allPassengersUpdateItinerary();
              break;
            }
          }
          if(toTerminal){
            for(var i = this.passengers.length - 1; i >= 0; i--){
              passenger.disembark(this, this.target.station, i);
            }
            this.clearParams();
            return;
          }
        }
        var stationPassengers = this.target.station.passengers;
        for(var i = stationPassengers.length - 1; i >= 0; i--) {
          var passenger = stationPassengers[i];
          if(passenger.itinerary[0] === this.route) {
            console.log("embarking")
            passenger.embark(this, this.target.station, i);
          }
        }
        if(this.forward){
          if(this.target.next !== null){
            this.travelNode = this.target;
            this.target = this.travelNode.next;
          } else {
            this.travelNode = this.target;
            this.forward = !this.forward;
            this.target = this.travelNode.last;
          }
        } else {
          if(this.target.last !== null){
            this.travelNode = this.target;
            this.target = this.travelNode.last;
          } else {
            this.travelNode = this.target;
            this.forward = !this.forward;
            this.target = this.travelNode.next;
          }
        }
        this.state = "travel";
        break;
      default:
    }

    // Draw
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = this.route.color;
    ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
    ctx.stroke();

    ctx.fillStyle = this.route.color;
    ctx.fill();

    ctx.closePath();
    ctx.rotate(-this.rotation);
    ctx.translate(-this.x, -this.y);

    return passengersDeliveredCount;
  }
}
