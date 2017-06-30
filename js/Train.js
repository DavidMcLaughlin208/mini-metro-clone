var Train = function(x, y, station){
  this.x = x;
  this.y = y;
  this.width = 30;
  this.height = 60;
  this.route = [];
  this.currentStation = station;
  this.speed = 0;

  this.draw = function(ctx){
    var target = this.currentStation.next;
    var remainingDistanceX = Math.pow(this.x - target.x, 2);
    var remainingDistanceY = Math.pow(this.y - target.y, 2);
    var remainingdistance = Math.sqrt(remainingDistanceX + remainingDistanceY);

    var distanceX = Math.pow(this.currentStation.x - target.x, 2);
    var distanceY = Math.pow(this.currentStation.y - target.y, 2);
    var totalDistance = Math.sqrt(distanceX + distanceY);

    var normalizeFactor = Math.max(Math.max(Math.abs(remainingDistanceX), 1), Math.max(Math.abs(remainingDistanceY), 1));
    var normalizedX = remainingDistanceX/normalizeFactor;
    var normalizedY = remainingDistanceY/normalizeFactor;
    this.x += normalizedX;
    this.y += normalizedY;

    ctx.translate(this.x, this.y);
    ctx.beginPath();
    
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'black';
    ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.fill();
    
    ctx.closePath();
    ctx.translate(-this.x, -this.y);
  }
}