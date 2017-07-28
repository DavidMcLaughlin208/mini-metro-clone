var TravelNode = function(){
  this.station = null;
  this.next = null;
  this.last = null;
  this.route = null;

  this.draw = function(ctx){

  }

  this.setStation = function(station){
    this.station = station;
    if(station.connections.indexOf(this) === -1){
      station.connections.push(this);
    }
  }
}
