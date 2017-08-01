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
      console.log(checkedNodes);
      console.log(queue)
      var node = queue.shift();
      badNodes.push(node);
      if(node.station.color === this.color){
        console.log("Found end: constructing path")
        console.log(cameFrom, node);
        console.log(badNodes)
        return this.reconstructPath(cameFrom, node);
      }
      var neighbors = node.station.connections;
      if(node.next){neighbors.push(node.next)}
      if(node.last){neighbors.push(node.last)}
      console.log("Neighbors: ")
      console.log(neighbors)

      for(var j in neighbors){
        var neighbor = neighbors[j];

        if(neighbor === node){continue}
        if(badNodes.indexOf(neighbor) !== -1){
          continue;
        }
        if(queue.indexOf(neighbor) === -1){
          console.log("adding to queue");
          queue.push(neighbor);
        }

        var score = checkedNodes[node.getId()] + 1;
        console.log("Tentative Score: " + score);
        console.log(checkedNodes[neighbor])
        console.log(checkedNodes)
        if(checkedNodes[neighbor.getId()] && checkedNodes[neighbor.getId()] <= score){
          console.log("Route to this node already has a better path")
          continue;
        }

        console.log("Marking path and score")
        cameFrom[neighbor.getId()] = node;
        console.log(cameFrom)
        checkedNodes[neighbor.getId()] = score;
      }
    }
    return [];
  }

  this.reconstructPath = function(cameFrom, endPoint){
    var itinerary = [endPoint];
    var current = endPoint;
    console.log(cameFrom)
    console.log(current.getId())
    console.log(Object.keys(cameFrom).indexOf(current.getId()))
    console.log(Object.keys(cameFrom))
    while(Object.keys(cameFrom).indexOf(current.getId()) !== -1){
      if(current.route !== cameFrom[current.getId()].route){
        itinerary.unshift(cameFrom[current]);
        console.log("adding to itinerary")
      }
      current = cameFrom[current.getId()];
      console.log(current)
    }
    console.log("itinerary: ")
    console.log(itinerary)
    return itinerary;
  }

  this.itinerary = this.getItinerary();

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
