var Train = function(x, y, travelNode, route){
  this.x = x;
  this.y = y;
  this.width = 60;
  this.height = 30;
  this.route = route;
  this.travelNode = travelNode;
  this.state = "travel";
  this.forward = true;
  this.passengers = [];
  this.rotation = 90;
  this.target = null;

  this.draw = function(ctx){
    if(this.forward){
      this.target = this.travelNode.next;
    } else {
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

        var xDirection = lastX - this.x;
        var slope = (this.y - lastY) / (this.x - lastX);
        this.rotation = Math.atan(slope) * (180/Math.PI);

        break;
      case "dock":
        console.log("Docking");
        for(var i = this.passengers.length - 1; i >= 0; i--){
          var passenger = this.passengers[i];
          if(passenger.itinerary[0] === this.target){
            console.log("disembarking")
            passenger.disembark(this, this.target.station, i);
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
          } else {
            this.travelNode = this.target;
            this.forward = !this.forward;
          }
        } else {
          if(this.target.last !== null){
            this.travelNode = this.target;
          } else {
            this.travelNode = this.target;
            this.forward = !this.forward;
          }
        }
        this.state = "travel";
        break;
      default:
    }

    // Draw
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation*Math.PI/180);
    ctx.beginPath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = 'black';
    ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.closePath();
    ctx.rotate(-this.rotation*Math.PI/180);
    ctx.translate(-this.x, -this.y);

  }
}
