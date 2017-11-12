var Passenger = function(station, shape){
  this.station = station;
  this.shape = shape;
  this.train = null;
  this.state = "station";
  this.x = station.x;
  this.y = station.y;

  this.draw = function(ctx, index, sizes){
    var size = sizes.passenger.size;
    if(this.station === null && this.train == null){return};
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    switch(this.state) {
    case "station":
      this.x = this.calcStationX(index, sizes);
      this.y = this.calcStationY(index, sizes);
      break;
    case "train":
      ctx.translate(this.train.x, this.train.y);
      ctx.rotate(this.train.rotation);
      this.x = this.calcTrainX(ctx, index, sizes);
      this.y = this.calcTrainY(ctx, index, sizes);
      break
    default:
      break;
    }
    ctx.translate(this.x, this.y);

    if(this.state === "train") {ctx.rotate(Math.PI/2)}

    switch(this.shape) {
      case "square":
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        ctx.closePath();
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, size/1.7, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        break;
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/1.7, size/2);
        ctx.lineTo(-size/1.7, size/2);
        ctx.lineTo(0, -size/2);
        ctx.lineTo(size/1.7, size/2);
        ctx.fill();
        ctx.closePath();
        break;
      case "diamond":
        ctx.rotate(45*Math.PI/180);
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        ctx.closePath();
        ctx.rotate(-45*Math.PI/180);
        break;
      case "plus":
        ctx.beginPath()
        ctx.rect(-size/5, -size/2, size/2.5, size);
        ctx.rect(-size/2, -size/5, size, size/2.5);
        ctx.fill();
        ctx.closePath();
        break;
      case "teardrop":
        ctx.rotate(Math.PI);
        ctx.beginPath();
        ctx.arc(0, 0, size/1.7, Math.PI, false);
        ctx.moveTo(-size/1.7, 0);
        ctx.lineTo(0, size/1.7);
        ctx.lineTo(size/1.7, 0);
        ctx.fill();
        ctx.rotate(-Math.PI);
        break;
      default:
    }
    if(this.state === "train") {ctx.rotate(-Math.PI/2)}
    ctx.translate(-this.x, -this.y);
    if(this.state === "train") {
      ctx.rotate(-this.train.rotation);
      ctx.translate(-this.train.x, -this.train.y);
    }
  }

  this.getItinerary = function(station){
    var checkedNodes = {};
    var badNodes = {};
    var cameFrom = {};
    var queue = [];
    var queueHelper = {};
    var connections = station ? station.connections : this.station.connections;
    for(var node of connections){
      queue.push(node);
      queueHelper[node.getId()] = true;
    }
    for(var i in queue){
      checkedNodes[queue[i].getId()] = 0;
    }
    while(queue.length > 0){
      var node = queue.shift();
      badNodes[node.getId()] = true;
      if(node.station.shape === this.shape){
        return this.reconstructPath(cameFrom, node);
      }
      var neighbors = [];
      if(node.station.connections !== connections) {
        for(var neighborNode of node.station.connections) {
          neighbors.push(neighborNode);
        }
      }
      if(node.next){neighbors.push(node.next)}
      if(node.last){neighbors.push(node.last)}

      for(var j in neighbors){
        var neighbor = neighbors[j];

        if(neighbor === node){continue}
        if(badNodes[neighbor.getId()]){
          continue;
        }
        if(!queueHelper[neighbor.getId()]){
          queue.push(neighbor);
          queueHelper[node.getId()] = true;
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
    var itinerary = [endPoint.station];
    itinerary.unshift(endPoint.route);
    var current = endPoint;
    while(Object.keys(cameFrom).indexOf(current.getId()) !== -1){
      if(current.route !== cameFrom[current.getId()].route){
        itinerary.unshift(cameFrom[current.getId()].station);
        itinerary.unshift(cameFrom[current.getId()].route);
      }
      current = cameFrom[current.getId()];
    }
    // console.log(itinerary)
    return itinerary;
  }

  this.itinerary = this.getItinerary();

  this.getAndSetItinerary = function(station){
    this.itinerary = this.getItinerary(station);
  }

  this.embark = function(train, station, index) {
    this.state = "train";
    this.itinerary.shift();
    station.passengers.splice(index, 1);
    this.train = train;
    this.station = null;
    train.passengers.unshift(this);
  }

  this.disembark = function(train, station, index){
    this.state = "station";
    this.itinerary.shift();
    train.passengers.splice(index, 1);
    this.train = null;
    if(station.shape === this.shape){
      // console.log("Arrived at destination");
      return 1;
    }
    this.station = station;
    station.passengers.unshift(this);
    this.getAndSetItinerary();
  }

  this.calcStationX = function(index, sizes){
    return this.station.x - sizes.station.size + index * sizes.passenger.size * 1.4;
  }
  this.calcStationY = function(index, sizes){
    // var multiplier = 1;
    // var rows = 1 + index;
    // while(rows > 4){
    //   rows -= 4;
    //   multiplier += 1;
    // }
    return this.station.y - sizes.station.size - sizes.passenger.size;
  }
  this.calcTrainY = function(ctx, index, sizes){
    if(index % 2 === 0){
      return sizes.train.height/4;
    } else {
      return -sizes.train.height/4;
    }
  }
  this.calcTrainX = function(ctx, index, sizes){
    return -(Math.floor(index/2) * sizes.train.width/4 + sizes.train.width/10) + sizes.train.width/2.2;
  }
}
