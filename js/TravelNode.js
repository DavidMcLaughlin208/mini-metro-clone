var TravelNode = function(id, route, midX, midY){
  this.id = id;
  this.route = route;
  this.station = null;
  this.next = null;
  this.last = null;
  this.x = null;
  this.y = null;
  this.lane = "middle"
  this.midX = midX;
  this.midY = midY;
  this.absoluteMidX = midX;
  this.absoluteMidY = midY;

  this.draw = function(ctx){

  }

  this.setStation = function(station){
    this.station = station;
    this.x = station.x;
    this.y = station.y;
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

  this.isHead = function() {
    return this.route.head === this
  }

  this.isTail = function() {
    return this.route.tail(this.route.head) === this
  }

  this.recalculateMidpoint = function(relative) {
    if(!this.last){return}
    var x = relative ? this.last.x : this.last.station.x;
    var y = relative ? this.last.y : this.last.station.y;
    var xDistance = Math.abs(this.x - x);
    var yDistance = Math.abs(this.y - y);
    var modifier = 1;
    var tempMidX = relative ? this.last.x : this.last.station.x;
    var tempMidY = relative ? this.last.y : this.last.station.y;
    if(xDistance > yDistance) {
      if(this.x < x) {
        modifier = -1;
      }
    } else {
      if(this.y < y) {
        modifier = -1;
      }
    }
    while(Math.abs(xDistance - yDistance) > 1) {
      if(xDistance > yDistance) {
        tempMidX += modifier;
      } else {
        tempMidY += modifier;
      }
      xDistance = Math.abs(this.x - tempMidX);
      yDistance = Math.abs(this.y - tempMidY);
    }
    if(relative) {
      this.midX = tempMidX;
      this.midY = tempMidY;
    } else {
      this.absoluteMidX = tempMidX;
      this.absoluteMidY = tempMidY;
    }
  }
}
