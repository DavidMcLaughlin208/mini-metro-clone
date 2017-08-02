var Passenger = function(station, color){
  this.station = station;
  this.color = color;
  this.train = null;
  this.state = "station";
  this.size = 7;

  this.draw = function(ctx, index){
    switch(this.state) {
    case "station":
      ctx.beginPath();
      ctx.arc(this.calcX(index), this.calcY(index), this.size, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      break;
    case "train":
      ctx.beginPath();
      ctx.arc(this.train.x, this.train.y, this.size, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      break
    default:
      break;
    }
  }

  this.getItinerary = function(){
    var checkedNodes = {};
    var badNodes = [];
    var cameFrom = {};
    var queue = this.station.connections;
    for(var i in queue){
      checkedNodes[queue[i].getId()] = 0;
    }
    while(queue.length > 0){
      var node = queue.shift();
      badNodes.push(node);
      if(node.station.color === this.color){
        return this.reconstructPath(cameFrom, node);
      }
      var neighbors = node.station.connections;
      if(node.next){neighbors.push(node.next)}
      if(node.last){neighbors.push(node.last)}

      for(var j in neighbors){
        var neighbor = neighbors[j];

        if(neighbor === node){continue}
        if(badNodes.indexOf(neighbor) !== -1){
          continue;
        }
        if(queue.indexOf(neighbor) === -1){
          queue.push(neighbor);
        }

        var score = checkedNodes[node.getId()] + 1;
        if(checkedNodes[neighbor.getId()] && checkedNodes[neighbor.getId()] <= score){
          continue;
        }

        cameFrom[neighbor.getId()] = node;
        checkedNodes[neighbor.getId()] = score;
      }
    }
    return [];
  }

  this.reconstructPath = function(cameFrom, endPoint){
    var itinerary = [endPoint];
    itinerary.unshift(endPoint.route);
    var current = endPoint;
    while(Object.keys(cameFrom).indexOf(current.getId()) !== -1){
      if(current.route !== cameFrom[current.getId()].route){
        itinerary.unshift(cameFrom[current.getId()]);
        itinerary.unshift(cameFrom[current.getId()].route);
      }
      current = cameFrom[current.getId()];
    }
    return itinerary;
  }

  this.itinerary = this.getItinerary();

  this.embark = function(train, station, index) {
    this.state = "train";
    this.itinerary.shift();
    station.passengers.splice(index, 1);
    this.train = this;
    this.station = null;
    train.passengers.unshift(this);
    console.log(this.itinerary)
  }

  this.disembark = function(train, station, index){
    this.state = "station";
    this.itinerary.shift();
    train.passengers.splice(index, 0);
    this.station = station;
    this.train = null;
    station.passengers.unshift(this);
    console.log(this.itinerary)
  }

  this.calcX = function(index){
    return this.station.x - this.station.size + index * this.size * 2;
  }
  this.calcY = function(index){
    // var multiplier = 1;
    // var rows = 1 + index;
    // while(rows > 4){
    //   rows -= 4;
    //   multiplier += 1;
    // }
    return this.station.y - this.station.size - this.size;
  }
}
