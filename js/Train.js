var Train = function(x, y, travelNode){
  this.x = x;
  this.y = y;
  this.width = 60;
  this.height = 30;
  this.route = [];
  this.travelNode = travelNode;
  this.state = "travel";
  this.forward = true;
  this.passengers = [];
  this.rotation = 90;

  this.draw = function(ctx){

    var target = null;
    if(this.forward){
      target = this.travelNode.next;
    } else {
      target = this.travelNode.last;
    } 
    var remainingDistanceX = this.x - target.station.x
    var remainingDistanceY = this.y - target.station.y
    var remainingdistance = Math.sqrt(Math.pow(remainingDistanceX, 2) + Math.pow(remainingDistanceY, 2));
    if(remainingdistance <= 1){
      this.state = "pickup";
    }

    switch(this.state) {
      case "travel":
        var distanceX = Math.pow(this.travelNode.x - target.x, 2);
        var distanceY = Math.pow(this.travelNode.y - target.y, 2);
        var totalDistance = Math.sqrt(distanceX + distanceY);

        var normalizeFactor = Math.max(Math.max(Math.abs(remainingDistanceX), 1), Math.max(Math.abs(remainingDistanceY), 1));
        var normalizedX = (remainingDistanceX/normalizeFactor) * 0.2;
        var normalizedY = (remainingDistanceY/normalizeFactor) * 0.2;
        var lastX = this.x;
        var lastY = this.y;

        this.x -= normalizedX;
        this.y -= normalizedY;

        var xDirection = lastX - this.x;
        var slope = (this.y - lastY) / (this.x - lastX);
        if(this.x >= 0 && this.y <= 0){
          // 1st Quadrant
          this.rotation = Math.atan(slope) * (180/Math.PI);
        } else if(this.x <= 0 && this.y <= 0){
          // 2st Quadrant
          this.rotation = Math.atan(slope) * (180/Math.PI);
        } else if(this.x <= 0 && this.y >= 0){
          // 3st Quadrant
          this.rotation = Math.atan(slope) * (180/Math.PI);
        } else if(this.x >= 0 && this.y >= 0){
          // 4st Quadrant
          this.rotation = Math.atan(slope) * (180/Math.PI);
        }

        break;
      case "pickup":
        if(this.forward){
          if(target.next !== null){
            this.travelNode = target;
          } else {
            this.travelNode = target;
            this.forward = !this.forward;
          }
        } else {
          if(target.last !== null){
            this.travelNode = target;
          } else {
            this.travelNode = target;
            this.forward = !this.forward;
          }
        }
        this.state = "travel";
        break;
      default:
        console.log("I DONT KNOW WHAT TO DO");
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
