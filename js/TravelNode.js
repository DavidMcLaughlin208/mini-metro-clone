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
}
