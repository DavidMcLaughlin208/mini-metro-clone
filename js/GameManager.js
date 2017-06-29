var GameManager = function(){
  this.metro = new Canvas('metro', 900, 600);
  this.passengers = [];
  this.trains = [];
  this.stations = [];


  this.draw = function(){

    this.metro.ctx.clearRect(0, 0, this.metro.width, this.metro.height);

    this.metro.ctx.fillStyle = '#f2f6ff';
    this.metro.ctx.fillRect(0, 0, this.metro.width, this.metro.height);
   
    for(var i in this.stations){
      this.stations[i].drawRoutes(this.metro.ctx);
    }

    for(var i in this.stations){
      this.stations[i].draw(this.metro.ctx);
    }

    for(var i in this.trains){
      this.trains[i].draw(this.metro.ctx);
    }

    
  }
}
