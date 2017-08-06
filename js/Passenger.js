var Passenger = function(station, shape){
  this.station = station;
  this.shape = shape;
  this.train = null;
  this.state = "station";
  this.size = 12;
  this.x = station.x;
  this.y = station.y;

  this.draw = function(ctx, index){
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    switch(this.state) {
    case "station":
      this.x = this.calcStationX(index);
      this.y = this.calcStationY(index);
      break;
    case "train":
      ctx.translate(this.train.x + this.train.width/2, this.train.y);
      ctx.rotate(this.train.rotation*Math.PI/180);
      // ctx.beginPath()
      // ctx.arc(0,0, this.size, 2 * Math.PI, false)
      // ctx.fill()
      this.x = this.calcTrainX(ctx, index);
      this.y = this.calcTrainY(ctx, index);
      break
    default:
      break;
    }

    switch(this.shape) {
      case "square":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.fill();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "circle":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.size/1.7, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "triangle":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(0, -this.size/2);
        ctx.lineTo(this.size/1.7, this.size/2);
        ctx.lineTo(-this.size/1.7, this.size/2);
        ctx.lineTo(0, -this.size/2);
        ctx.lineTo(this.size/1.7, this.size/2);
        ctx.fill();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "diamond":
        ctx.translate(this.x, this.y);
        ctx.rotate(45*Math.PI/180);
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.fill();
        ctx.closePath();
        ctx.rotate(-45*Math.PI/180);
        ctx.translate(-this.x, -this.y);
        break;
      case "plus":
        ctx.translate(this.x, this.y);
        ctx.beginPath()
        ctx.rect(-this.size/5, -this.size/2, this.size/2.5, this.size);
        ctx.rect(-this.size/2, -this.size/5, this.size, this.size/2.5);
        ctx.fill();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "teardrop":
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI);
        ctx.beginPath();
        ctx.arc(0, 0, this.size/1.7, Math.PI, false);
        ctx.moveTo(-this.size/1.7, 0);
        ctx.lineTo(0, this.size/1.7);
        ctx.lineTo(this.size/1.7, 0);
        ctx.fill();
        ctx.rotate(-Math.PI);
        ctx.translate(-this.x, -this.y);
        break;
      default:
    }
    if(this.state === "train") {
      ctx.rotate(-this.train.rotation*Math.PI/180);
      ctx.translate(-this.train.x - this.train.width/2, -this.train.y);
    }
  }

  this.getItinerary = function(){
    var checkedNodes = {};
    var badNodes = [];
    var cameFrom = {};
    var queue = [];
    for(var node of this.station.connections){
      queue.push(node);
    }
    for(var i in queue){
      checkedNodes[queue[i].getId()] = 0;
    }
    while(queue.length > 0){
      var node = queue.shift();
      badNodes.push(node);
      if(node.station.shape === this.shape){
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
    console.log(itinerary)
    return itinerary;
  }

  this.itinerary = this.getItinerary();

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
    train.passengers.splice(index, 0);
    this.station = station;
    this.train = null;
    station.passengers.unshift(this);
  }

  this.calcStationX = function(index){
    return this.station.x - this.station.size + index * this.size * 1.4;
  }
  this.calcStationY = function(index){
    // var multiplier = 1;
    // var rows = 1 + index;
    // while(rows > 4){
    //   rows -= 4;
    //   multiplier += 1;
    // }
    return this.station.y - this.station.size - this.size;
  }
  this.calcTrainY = function(ctx, index){
    if(index % 2 === 0){
      return this.train.height/4 + this.train.height/16;
    } else {
      return -this.train.height/4 - this.train.height/16;
    }
  }
  this.calcTrainX = function(ctx, index){
    return -(Math.ceil(index/2) * this.train.width/4 + this.train.width/5);
  }
}
