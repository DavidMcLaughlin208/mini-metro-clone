var Station = function(x, y, shape){
  this.x = x;
  this.y = y;
  this.shape = shape;
  this.connections = [];
  this.passengers = [];

  this.ports = {
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": [],
    "7": [],
    "8": [],
  }



  this.headDeltas = function(node) {
    var deltaX = Math.floor(node.next.absoluteMidX - this.x);
    var deltaY = Math.floor(node.next.absoluteMidY - this.y);

    return {"deltaX": deltaX,
            "deltaY": deltaY}
  }

  this.tailDeltas = function(node) {
    var deltaX = Math.floor(node.absoluteMidX - this.x);
    var deltaY = Math.floor(node.absoluteMidY - this.y);

    return {"deltaX": deltaX,
            "deltaY": deltaY}
  }

  this.getPort = function(deltaX, deltaY) {
    var port = null;
    if(deltaX < 0 && deltaY < 0) {
      port = "1";
    } else if(deltaX === 0 && deltaY < 0) {
      port = "2";
    } else if(deltaX > 0 && deltaY < 0) {
      port = "3";
    } else if(deltaX > 0 && deltaY === 0) {
      port = "4"
    } else if(deltaX > 0 && deltaY > 0) {
      port = "5";
    } else if(deltaX === 0 && deltaY > 0) {
      port = "6";
    } else if(deltaX < 0 && deltaY > 0) {
      port = "7";
    } else if(deltaX < 0 && deltaY === 0) {
      port = "8";
    }
    return port;
  }

  this.calculateInputs = function(sizes) {
    this.ports = {
      "1": [],
      "2": [],
      "3": [],
      "4": [],
      "5": [],
      "6": [],
      "7": [],
      "8": [],
    }
    var straight = sizes.station.size/3;
    var angled = Math.sqrt(sizes.station.size/2)
    for(var node of this.connections) {
      var headPort = null;
      var tailPort = null;
      if(node.isHead() && node.next) {
        var headDeltas = this.headDeltas(node);
        headPort = this.getPort(headDeltas.deltaX, headDeltas.deltaY);

        this.ports[headPort].push(node);

      } else if(node.isTail() && node.last) {
        var tailDeltas = this.tailDeltas(node);
        tailPort = this.getPort(tailDeltas.deltaX, tailDeltas.deltaY);

        this.ports[tailPort].push(node)
      } else if(node.next) {
        var headDeltas = this.headDeltas(node);
        headPort = this.getPort(headDeltas.deltaX, headDeltas.deltaY);
        this.ports[headPort].push(node);

        var tailDeltas = this.tailDeltas(node);
        tailPort = this.getPort(tailDeltas.deltaX, tailDeltas.deltaY);
        this.ports[tailPort].push(node)
      }
      if(headPort){console.log("headPort: ", headPort)}
      if(tailPort){console.log("tailPort: ", tailPort)}
    }

    for(var port = 1; port <= 8; port++) {
      this.calculateLanes(port.toString(), straight, angled);
    }


  }

  this.calculateLanes = function(port, straight, angled) {
    var availableLanes = ["middle", "left", "right"];
    nodes = this.ports[port];
    for(var node of nodes) {
      var index = availableLanes.indexOf(node.lane);
      if(index !== -1) {
        availableLanes.splice(index, 1)
      } else {
        node.lane = availableLanes.splice(0, 1)[0]
      }
      console.log(node.lane)
      switch(port) {
        case "1":
          if(node.lane = "left") {
            node.x = this.x - angled;
            node.y = this.y + angled;
          } else if(node.lane = "right") {
            node.x = this.x + angled;
            node.y = this.y - angled;
          } else {
            node.x = this.x;
            node.y = this.y;
          }
          break;
        case "2":
          if(node.lane = "left") {
            node.x = this.x - straight;
            node.y = this.y;
          } else if(node.lane = "right") {
            node.x = this.x + straight;
            node.y = this.y;
          } else {
            node.x = this.x;
            node.y = this.y;
          }
          break;
        case "3":
          if(node.lane = "left") {
            node.x = this.x - angled;
            node.y = this.y - angled;
          } else if(node.lane = "right") {
            node.x = this.x + angled;
            node.y = this.y + angled;
          } else {
            node.x = this.x;
            node.y = this.y;
          }
          break;
        case "4":
          if(node.lane = "left") {
            node.x = this.x;
            node.y = this.y - straight;
          } else if(node.lane = "right") {
            node.x = this.x;
            node.y = this.y + straight;
          } else {
            node.x = this.x;
            node.y = this.y;
          }
          break;
        case "5":
          if(node.lane = "left") {
            node.x = this.x + angled;
            node.y = this.y - angled;
          } else if(node.lane = "right") {
            node.x = this.x - angled;
            node.y = this.y + angled;
          } else {
            node.x = this.x;
            node.y = this.y;
          }
          break;
        case "6":
          if(node.lane = "left") {
            node.x = this.x + straight;
            node.y = this.y;
          } else if(node.lane = "right") {
            node.x = this.x - straight;
            node.y = this.y;
          } else {
            node.x = this.x;
            node.y = this.y;
          }
          break;
        case "7":
          if(node.lane = "left") {
            node.x = this.x + angled;
            node.y = this.y + angled;
          } else if(node.lane = "right") {
            node.x = this.x - angled;
            node.y = this.y - angled;
          } else {
            node.x = this.x;
            node.y = this.y;
          }
          break;
        case "8":
          if(node.lane = "left") {
            node.x = this.x;
            node.y = this.y + straight;
          } else if(node.lane = "right") {
            node.x = this.x;
            node.y = this.y - straight;
          } else {
            node.x = this.x;
            node.y = this.y;
          }
          break;
      }
    }
  }

  this.draw = function(ctx, sizes){
    var size = sizes.station.size;
    var lineWidth = sizes.station.lineWidth;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    switch(this.shape) {
      case "square":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "circle":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, size/1.7, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "triangle":
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/1.7, size/2);
        ctx.lineTo(-size/1.7, size/2);
        ctx.lineTo(0, -size/2);
        ctx.lineTo(size/1.7, size/2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "diamond":
        ctx.translate(this.x, this.y);
        ctx.rotate(45*Math.PI/180);
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.rotate(-45*Math.PI/180);
        ctx.translate(-this.x, -this.y);
        break;
      case "plus":
        ctx.translate(this.x, this.y);
        ctx.lineWidth = lineWidth * 2;
        ctx.beginPath()
        ctx.rect(-size/6, -size/2, size/3, size);
        ctx.stroke();
        ctx.rect(-size/2, -size/6, size, size/3);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.translate(-this.x, -this.y);
        break;
      case "teardrop":
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI);
        ctx.beginPath();
        ctx.arc(0, 0, size/1.7, Math.PI, false);
        ctx.moveTo(-size/1.7, 0);
        ctx.lineTo(0, size/1.7);
        ctx.lineTo(size/1.7, 0);
        ctx.fill();
        ctx.stroke();
        ctx.rotate(-Math.PI);
        ctx.translate(-this.x, -this.y);
        break;
      default:
        break;
    }
  }

}
