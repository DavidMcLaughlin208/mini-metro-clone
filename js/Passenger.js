var Passenger = function(station, color){
  this.station = station;
  this.color = color;
  this.train = null;
  this.state = "station";
  this.size = 7;
  this.itinerary = [];

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
      checkedNodes[queue[i]] = 0;
    }
    var finalNode = null;
    while(queue.length > 0){
      var node = queue.shift();
      badNodes.push(node);
      if(node.station.color === this.color){
        this.reconstructPath(cameFrom, node);
      }
      var neighbors = node.station.connections;
      if(node.next){neighbors.push(node.next)}
      if(node.next){neighbors.push(node.last)}

      for(var j in neighbors){
        var neighbor = neighbors[j];
        if(queue.indexOf(neighbor) !== -1){
          queue.push(neighbor);
        }

        var score = checkedNodes[node] + 1;
        if(checkedNodes[neighbor] <= score){
          continue;
        }

        cameFrom[neighbor] = node;
        checkedNodes[neighbor] = score;
      }
    }
  }

  this.reconstructPath = function(cameFrom, endPoint){
    this.itinerary = [endPoint];
    var current = endPoint;
    while(Object.keys(cameFrom).indexOf(current) !== -1){
      if(current.route !== cameFrom[current].route){
        this.itinerary.unshift(cameFrom[current]);
      }
      current = cameFrom[current];
    }
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
