var TravelNode = function(id, route, midX, midY){
  this.id = id;
  this.route = route;
  this.station = null;
  this.next = null;
  this.last = null;
  this.midX = midX;
  this.midY = midY;

  this.draw = function(ctx){

  }

  this.setStation = function(station){
    this.station = station;
    // if(!this.midX){this.midX = station.x}
    // if(!this.midY){this.midY = station.y}
    if(station.connections.indexOf(this) === -1){
      station.connections.push(this);
    }
  }

  this.getId = function(){
    return this.id.toString();
  }

  this.delete = function(){
    var index = this.station.connections.indexOf(this);
    if(index !== -1){
      this.station.connections.splice(index, 1);
    }
    this.route = null;
    setTimeout(removeStation.bind(this), 20000);
    this.next = null;
    this.last = null;
  }

  function removeStation() {
    this.station = null;
  }

  this.recalculateMidpoint = function() {
    if(!this.last){return}
    var xDistance = Math.abs(this.station.x - this.last.station.x);
    var yDistance = Math.abs(this.station.y - this.last.station.y);
    var modifier = 1;
    var tempMidX = this.last.station.x;
    var tempMidY = this.last.station.y;
    if(xDistance > yDistance) {
      if(this.station.x < this.last.station.x) {
        modifier = -1;
      }
    } else {
      if(this.station.y < this.last.station.y) {
        modifier = -1;
      }
    }
    while(Math.abs(xDistance - yDistance) > 2) {
      if(xDistance > yDistance) {
        tempMidX += modifier;
      } else {
        tempMidY += modifier;
      }
      xDistance = Math.abs(this.station.x - tempMidX);
      yDistance = Math.abs(this.station.y - tempMidY);
    }

    this.midX = tempMidX;
    this.midY = tempMidY;
  }
}
