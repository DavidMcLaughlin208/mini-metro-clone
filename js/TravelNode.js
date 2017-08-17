var TravelNode = function(id, route){
  this.id = id;
  this.route = route;
  this.station = null;
  this.next = null;
  this.last = null;

  this.draw = function(ctx){

  }

  this.setStation = function(station){
    this.station = station;
    if(station.connections.indexOf(this) === -1){
      station.connections.push(this);
    }
  }

  this.getId = function(){
    return this.id.toString();
  }

  this.delete = function(){
    this.route = null;
    this.station = null;
    this.next = null;
    this.last = null;
    var index = this.station.connections.indexOf(this);
    if(index !== -1){
      station.connections.slice(index, 1);
    }
  }
}
