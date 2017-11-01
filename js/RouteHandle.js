var RouteHandle = function(route, location, sizeRatio){
  this.x = null;
  this.y = null;
  this.route = route;
  this.location = location;
  this.state = "node";
  this.rotation = 0;

  this.getNode = function(){
    if(this.location === "head"){
      return this.route.head
    }else if(this.location === "tail"){
      return this.route.tail(this.route.head);
    }
  }

  // this.draw = function(x, y, rotation, station, ctx, sizes){
  //   if(this.route.getLength() <= 1 && this.location === "tail") {return}
  //   ctx.lineWidth = sizes.route.lineWidth;
  //   this.x = x;
  //   this.y = y;
  //   ctx.beginPath();
  //   ctx.moveTo(station.x, station.y);
  //   ctx.lineTo(x, y);
  //   ctx.stroke();
  //   ctx.closePath();
  //
  //   ctx.translate(x, y);
  //   ctx.rotate(rotation);
  //
  //   ctx.beginPath();
  //   ctx.moveTo(0, sizes.station.size/1.5);
  //   ctx.lineTo(0, -sizes.station.size/1.5);
  //   ctx.stroke();
  //   ctx.closePath();
  //
  //   ctx.rotate(-rotation);
  //   ctx.translate(-x, -y);
  // }

  this.calculatePort = function(sizes) {
    if(!this.getNode()) {return}
    var port = this.location === "head" ? this.getNode().exitPort : this.getNode().enterPort;
    if(!port) {return}
    var straight = sizes.station.size * 1.7;
    var angled = Math.sqrt(Math.pow(straight, 2)/2);

    var oppositePort = this.getOppositePort(parseInt(port));
    var targetPort = this.validatePort(oppositePort);
    if(!targetPort) {return}
    this.setPositionByPort(targetPort.toString(), straight, angled);
  }

  this.draw = function(ctx, sizes, connectingHandle) {
    if(connectingHandle === this || !this.getNode()) {return}
    if(this.route.getLength() <= 1) {return}
    var handleGirth = sizes.station.size * 0.63;

    ctx.strokeStyle = this.getNode().route.color;
    ctx.lineWidth = sizes.route.lineWidth;

    ctx.beginPath();
    ctx.moveTo(this.getNode().station.x, this.getNode().station.y);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.moveTo(-handleGirth, 0);
    ctx.lineTo(handleGirth, 0)
    ctx.stroke();
    ctx.rotate(-this.rotation);
    ctx.translate(-this.x, -this.y);
  }

  this.getOppositePort = function(port) {
    var oppositePort = port + 4;
    if(oppositePort > 8) {
      oppositePort -= 8;
    }
    return oppositePort;
  }

  this.validatePort = function(port) {
    var initialValue = port;
    var ports = this.getNode().station.ports;
    var subtract = true;
    var modifier = 0;
    while(true) {
      var noLanesInPort = ports[port].entering.length === 0 && ports[port].exiting.length === 0;
      if(noLanesInPort && !ports[port].routeHandle) {
        ports[port].routeHandle = this;
        return port;
      } else {
        if(modifier === 8) {return}
        if(subtract) {
          port -= modifier;
        } else {
          port += modifier;
        }
        subtract = !subtract;
        modifier += 1
        if(port > 8) {port -= 8}
        if(port < 1) {port += 8}
      }
    }
  }

  this.setPositionByPort = function(port, straight, angled) {
    var stationX = this.getNode().station.x;
    var stationY = this.getNode().station.y;
    switch(port) {
      case "1":
        this.x = stationX - angled;
        this.y = stationY - angled;
        this.rotation = 315 * Math.PI/180;
        break;
      case "2":
        this.x = stationX;
        this.y = stationY - straight;
        this.rotation = 0 * Math.PI/180;
        break;
      case "3":
        this.x = stationX + angled;
        this.y = stationY - angled;
        this.rotation = 45 * Math.PI/180;
        break;
      case "4":
        this.x = stationX + straight;
        this.y = stationY;
        this.rotation = 90 * Math.PI/180;
        break;
      case "5":
        this.x = stationX + angled;
        this.y = stationY + angled;
        this.rotation = 135 * Math.PI/180;
        break;
      case "6":
        this.x = stationX;
        this.y = stationY + straight;
        this.rotation = 180 * Math.PI/180;
        break;
      case "7":
        this.x = stationX - angled;
        this.y = stationY + angled;
        this.rotation = 225 * Math.PI/180;
        break;
      case "8":
        this.x = stationX - straight;
        this.y = stationY;
        this.rotation = 270 * Math.PI/180;
        break;
    }
  }
}
