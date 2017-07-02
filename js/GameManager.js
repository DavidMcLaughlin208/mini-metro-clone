var GameManager = function(){
  this.metro = new Canvas('metro', 900, 600);
  this.passengers = [];
  this.trains = [];
  this.stations = [];
  this.travelNodes = [];
  this.routes = {};

  this.connectingStation = null;
  this.mouseX = 0;
  this.mouseY = 0;


  this.draw = function(){

    // Reset canvas and draw background
    this.metro.ctx.clearRect(0, 0, this.metro.width, this.metro.height);

    this.metro.ctx.fillStyle = '#f2f6ff';
    this.metro.ctx.fillRect(0, 0, this.metro.width, this.metro.height);


   
    for(var i in this.stations){
      this.travelNodes[i].drawRoutes(this.metro.ctx);
    }

    if(this.connectingStation){
      this.drawTempRoute(this.metro.ctx)
    }

    for(var i in this.trains){
      this.trains[i].draw(this.metro.ctx);
    }

    for(var i in this.stations){
      this.stations[i].draw(this.metro.ctx);
    }
    
  }

  this.drawTempRoute = function(ctx){
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5';
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
    console.log(station)
    console.log(route.head)
    console.log(route.tail(route.head))
    if(station === route.head.station || station === route.tail(route.head).station){
      return true
    }
    return false;
  }
}
