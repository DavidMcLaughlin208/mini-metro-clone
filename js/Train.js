var Train = function(){
  this.x = null;
  this.y = null;
  this.route = null;
  this.travelNode = null;
  this.state = "travel";
  this.forward = true;
  this.passengers = [];
  this.rotation = null;
  this.targetRotation = null;
  this.target = null;
  this.passedMid = false;


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

  this.draw = function(ctx, sizes){
    if(this.x === null || this.y === null || this.travelNode === null || this.route === null){return 0;}
    var passengersDeliveredCount = 0;
    if(!this.target && this.forward){
      this.target = this.travelNode.next;
    } else if(!this.target && !this.forward) {
      this.target = this.travelNode.last;
    }
    var targetX = null;
    var targetY = null;
    if(this.passedMid) {
      targetX = this.target.station.x;
      targetY = this.target.station.y;
    } else {
      if(this.forward){
        targetX = this.target.midX;
        targetY = this.target.midY;
      } else {
        targetX = this.target.next.midX;
        targetY = this.target.next.midY;
      }
    }
    var remainingDistanceX = this.x - targetX;
    var remainingDistanceY = this.y - targetY;
    var remainingDistance = Math.sqrt(Math.pow(remainingDistanceX, 2) + Math.pow(remainingDistanceY, 2));
    if(this.passedMid && remainingDistance <= 1){
      this.state = "dock";
    } else if(!this.passedMid && remainingDistance <= 1) {
      this.passedMid = true;
    }

    switch(this.state) {
      case "travel":
        var distanceX = Math.pow(this.travelNode.x - this.target.x, 2);
        var distanceY = Math.pow(this.travelNode.y - this.target.y, 2);
        var totalDistance = Math.sqrt(distanceX + distanceY);

        var speedRatio = sizes.train.speed;

        var normalizeFactor = Math.max(Math.max(Math.abs(remainingDistanceX), 1), Math.max(Math.abs(remainingDistanceY), 1));
        var normalizedX = (remainingDistanceX/normalizeFactor) * 0.3 * speedRatio;
        var normalizedY = (remainingDistanceY/normalizeFactor) * 0.3 * speedRatio;
        var lastX = this.x;
        var lastY = this.y;

        this.x -= normalizedX;
        this.y -= normalizedY;

        var slope = Math.atan((this.y - lastY) / (this.x - lastX));
        this.rotation = slope;

        // if(!this.rotation){this.rotation = slope}
        // this.targetRotation = slope;
        // console.log(this.targetRotation)
        // if(this.targetRotation > this.rotation) {
        //   this.rotation += .005;
        // } else {
        //   this.rotation -= .005;
        // }
        // console.log(this.rotation)

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
        this.passedMid = false;
        this.state = "travel";
        break;
      default:
    }

    // Draw
    var width = sizes.train.width;
    var height = sizes.train.height;

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.rect(-width/2, -height/2, width, height);
    ctx.fillStyle = this.route.color;
    ctx.fill();

    ctx.closePath();
    ctx.rotate(-this.rotation);
    ctx.translate(-this.x, -this.y);

    return passengersDeliveredCount;
  }
}
