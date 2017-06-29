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
    var remainingdistance = Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y), 2);
    var totalDistance = Math.sqrt(Math.pow(this.currentStation.x - target.x, 2) + Math.pow(this.currentStation.y - target.y), 2);
    console.log(remainingdistance)
    console.log(totalDistance)

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
