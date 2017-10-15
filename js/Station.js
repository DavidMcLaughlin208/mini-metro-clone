var Station = function(x, y, shape){
  this.x = x;
  this.y = y;
  this.shape = shape;
  this.connections = [];
  this.passengers = [];

  this.ports = {
    "1": {entering: [], exiting: []},
    "2": {entering: [], exiting: []},
    "3": {entering: [], exiting: []},
    "4": {entering: [], exiting: []},
    "5": {entering: [], exiting: []},
    "6": {entering: [], exiting: []},
    "7": {entering: [], exiting: []},
    "8": {entering: [], exiting: []},
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
      "1": {entering: [], exiting: []},
      "2": {entering: [], exiting: []},
      "3": {entering: [], exiting: []},
      "4": {entering: [], exiting: []},
      "5": {entering: [], exiting: []},
      "6": {entering: [], exiting: []},
      "7": {entering: [], exiting: []},
      "8": {entering: [], exiting: []},
    }
    var straight = sizes.station.size/2.5;
    var angled = sizes.station.size/5;//Math.sqrt(sizes.station.size/2.5)
    for(var node of this.connections) {
      var headPort = null;
      var tailPort = null;
      if(node.isHead() && node.next) {
        var headDeltas = this.headDeltas(node);
        headPort = this.getPort(headDeltas.deltaX, headDeltas.deltaY);
        if(!headPort){return}
        this.ports[headPort]["exiting"].push(node);

      } else if(node.isTail() && node.last) {
        var tailDeltas = this.tailDeltas(node);
        tailPort = this.getPort(tailDeltas.deltaX, tailDeltas.deltaY);
        if(!tailPort){return}
        this.ports[tailPort]["entering"].push(node);
      } else if(node.next) {
        var headDeltas = this.headDeltas(node);
        headPort = this.getPort(headDeltas.deltaX, headDeltas.deltaY);
        if(headPort) {
          this.ports[headPort]["exiting"].push(node);
        }

        var tailDeltas = this.tailDeltas(node);
        tailPort = this.getPort(tailDeltas.deltaX, tailDeltas.deltaY);
        if(tailPort) {
          this.ports[tailPort]["entering"].push(node);
        }
      }
      if(headPort){console.log("headPort: ", headPort)}
      if(tailPort){console.log("tailPort: ", tailPort)}
    }

    for(var port = 1; port <= 8; port++) {
      this.calculateLanes(port.toString(), straight, angled, true);
      this.calculateLanes(port.toString(), straight, angled, false);
    }


  }

  this.calculateLanes = function(port, straight, angled, enteringLanes) {
    var availableLanes = ["middle", "left", "right"];
    var nodes = this.ports[port];
    if(enteringLanes) {
      nodes = nodes["entering"]; //this.resolveEnterLanes(nodes["entering"]);
    } else {
      nodes = nodes["exiting"];
    }
    var middleTaken = false;
    for(var node of nodes) {
      if(enteringLanes) {
        if(!middleTaken) {
          node.enterLane = this.reverseLane(node.last.exitLane);
          if(node.enterLane === "middle") {
            middleTaken = true;
            availableLanes = ["left", "right"];
          }
        } else {
          node.enterLane = availableLanes.splice(0, 1)[0]
        }
      } else {
        if(nodes.length !== 1) {
          var index = availableLanes.indexOf(node.exitLane);
          if(index !== -1) {
            availableLanes.splice(index, 1)
          } else {
            node.exitLane = availableLanes.splice(0, 1)[0]
          }
        } else {
          node.exitLane = "middle";
        }
      }

      if(availableLanes[0] === "middle") {
        nodes[0].exitLane = "middle";
      }

      for(var node of nodes) {
        this.applyOffsetByPort(node, straight, angled, enteringLanes);
      }
    }

    this.applyOffsetByPort = function(node, straight, angled, enteringLanes) {
      // console.log(node.route.color, enteringLanes ? node.enterLane : node.exitLane)
      var lane = enteringLanes ? node.enterLane : node.exitLane;
      switch(port) {
        case "1":
          if(lane === "left") {
            this.applyOffsetX(node, this.x - angled, enteringLanes);
            this.applyOffsetY(node, this.y + angled, enteringLanes);
          } else if(lane === "right") {
            this.applyOffsetX(node, this.x + angled, enteringLanes);
            this.applyOffsetY(node, this.y - angled, enteringLanes);
          } else {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          }
          break;
        case "2":
          if(lane === "left") {
            this.applyOffsetX(node, this.x - straight, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          } else if(lane === "right") {
            this.applyOffsetX(node, this.x + straight, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          } else {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          }
          break;
        case "3":
          if(lane === "left") {
            this.applyOffsetX(node, this.x - angled, enteringLanes);
            this.applyOffsetY(node, this.y - angled, enteringLanes);
          } else if(lane === "right") {
            this.applyOffsetX(node, this.x + angled, enteringLanes);
            this.applyOffsetY(node, this.y + angled, enteringLanes);
          } else {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          }
          // console.log(node.x - this.x)
          // console.log(node.y - this.y)
          break;
        case "4":
          if(lane === "left") {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y - straight, enteringLanes);
          } else if(lane === "right") {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y + straight, enteringLanes);
          } else {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          }
          break;
        case "5":
          if(lane === "left") {
            this.applyOffsetX(node, this.x + angled, enteringLanes);
            this.applyOffsetY(node, this.y - angled, enteringLanes);
          } else if(lane === "right") {
            this.applyOffsetX(node, this.x - angled, enteringLanes);
            this.applyOffsetY(node, this.y + angled, enteringLanes);
          } else {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          }
          break;
        case "6":
          if(lane === "left") {
            this.applyOffsetX(node, this.x + straight, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          } else if(lane === "right") {
            this.applyOffsetX(node, this.x - straight, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          } else {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          }
          break;
        case "7":
          if(lane === "left") {
            this.applyOffsetX(node, this.x + angled, enteringLanes);
            this.applyOffsetY(node, this.y + angled, enteringLanes);
          } else if(lane === "right") {
            this.applyOffsetX(node, this.x - angled, enteringLanes);
            this.applyOffsetY(node, this.y - angled, enteringLanes);
          } else {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          }
          break;
        case "8":
          if(lane === "left") {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y + straight, enteringLanes);
          } else if(lane === "right") {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y - straight, enteringLanes);
          } else {
            this.applyOffsetX(node, this.x, enteringLanes);
            this.applyOffsetY(node, this.y, enteringLanes);
          }
          break;
      }
    }
  }

  this.applyOffsetX = function(node, value, entering) {
    if(entering) {
      node.enterX = value;
    } else {
      node.exitX = value;
    }
  }

  this.applyOffsetY = function(node, value, entering) {
    if(entering) {
      node.enterY = value;
    } else {
      node.exitY = value;
    }
  }

  this.reverseLane = function(lane) {
    if(lane === "left") {
      return "right";
    } else if(lane === "right") {
      return "left";
    } else {
      return "middle";
    }
  }

  this.resolveEnterLanes = function(nodes) {
    var availableLanes = ["middle", "left", "right"];
    for(var node of nodes) {
      if(nodes.length !== 1) {
        var index = availableLanes.indexOf(node.enterLane);
        if(index !== -1) {
          availableLanes.splice(index, 1)
        } else {
          node.enterLane = availableLanes.splice(0, 1)[0]
        }
      } else {
        node.enterLane = "middle";
      }
    }
    if(availableLanes === ["middle"]) {
      nodes[0].enterLane = "middle";
    }
    return nodes;
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
