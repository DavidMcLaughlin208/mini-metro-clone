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
      checkedNodes[queue[i]] = 0;
    }
    while(queue.length > 0){
      console.log(checkedNodes);
      console.log(queue)
      var node = queue.shift();
      badNodes.push(node);
      if(node.station.color === this.color){
        console.log("Found end: constructing path")
        return this.reconstructPath(cameFrom, node);
      }
      var neighbors = node.station.connections;
      if(node.next){neighbors.push(node.next)}
      if(node.last){neighbors.push(node.last)}
      console.log("Neighbors: ")
      console.log(neighbors)

      for(var j in neighbors){
        var neighbor = neighbors[j];
        if(queue.indexOf(neighbor) === -1 && badNodes.indexOf(neighbor) === -1){
          console.log("adding to queue");
          queue.push(neighbor);
        }

        var score = checkedNodes[node] + 1;
        console.log("Tentative Score: " + score);
        console.log(checkedNodes[neighbor])
        console.log(checkedNodes)
        if(checkedNodes[neighbor] && checkedNodes[neighbor] <= score){
          console.log("Route to this node already has a better path")
          continue;
        }

        console.log("Marking path and score")
        cameFrom[neighbor] = node;
        console.log(cameFrom)
        checkedNodes[neighbor] = score;
      }
    }
    return [];
  }

  this.reconstructPath = function(cameFrom, endPoint){
    var itinerary = [endPoint];
    var current = endPoint;
    console.log(cameFrom)
    console.log(Object.keys(cameFrom).indexOf(current))
    while(Object.keys(cameFrom).indexOf(current) !== -1){
      console.log("Current Route:")
      console.log(current.route)
      console.log("Next Route:")
      console.log(cameFrom[current].route)
      if(current.route !== cameFrom[current].route){
        itinerary.unshift(cameFrom[current]);
      }
      current = cameFrom[current];
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
