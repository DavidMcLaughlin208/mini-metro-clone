var GameManager = function(){
  this.metro = new Canvas('metro', 900, 600);
  this.passengers = [];
  this.trains = [];
  this.stations = [];
  this.travelNodes = [];
  this.routes = {};
  this.colors = {
    "BACKGROUND": "#f2f6ff",
    "BLUE": "#4f83ff",
    "ORANGE": "#ff8644",
    "RED": "#ff4444",
    "PURPLE": "#ff3feb",
    "TEMPROUTE": "rgba(0, 0, 0, 0.5)"
  }

  this.connectingStation = null;
  this.connectingNode = null;
  this.mouseX = 0;
  this.mouseY = 0;


  this.draw = function(){

    // Reset canvas and draw background
    this.metro.ctx.clearRect(-this.metro.width/2, -this.metro.height/2, this.metro.width, this.metro.height);

    this.metro.ctx.fillStyle = this.colors.BACKGROUND;
    this.metro.ctx.fillRect(-this.metro.width/2, -this.metro.height/2, this.metro.width, this.metro.height);



    // for(var i in this.travelNodes){
    //   this.travelNodes[i].drawRoutes(this.metro.ctx, this.routes);
    // }

    for (var property in this.routes) {
      if (this.routes.hasOwnProperty(property)) {
        this.routes[property].draw(this.metro.ctx, this.routes[property].head);
      }
    }

    if(this.connectingStation){
      this.drawTempRoute(this.metro.ctx)
    }

    for(var i in this.stations){
      this.stations[i].draw(this.metro.ctx);
      var passengers = this.stations[i].passengers;
      for(var j in passengers) {
        passengers[j].draw(this.metro.ctx, j);
      }
    }

    for(var i in this.trains){
      this.trains[i].draw(this.metro.ctx);
      for(var j in this.trains[i].passengers){
        this.trains[i].passengers[j].draw(this.metro.ctx, j);
      }
    }


  }

  this.drawTempRoute = function(ctx){
    ctx.strokeStyle = this.colors.TEMPROUTE;
    ctx.lineWidth = 20;

    ctx.beginPath();
    ctx.moveTo(this.connectingStation.x, this.connectingStation.y)
    ctx.lineTo(this.mouseX, this.mouseY);
    ctx.stroke();
    ctx.closePath();
  }

  this.isValidConnection = function(node, station){
    if(node.station === station){return false}
    if(node.next === null){return true}
    return this.isValidConnection(node.next, station)
  }

  this.headOrTail = function(station, route){
    if(station === route.head.station){
      return route.head;
    } else if (station === route.tail(route.head).station){
      return route.tail(route.head);
    }
    return null;
  }
}
