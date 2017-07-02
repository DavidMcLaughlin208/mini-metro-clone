var TravelNode = function(){
  this.station = null;
  this.next = null;
  this.last = null;


  this.draw = function(ctx){

  }

  this.drawRoutes = function(ctx){
    if(this.next){
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 20;

      ctx.beginPath();
      ctx.moveTo(this.station.x, this.station.y)
      ctx.lineTo(this.next.station.x, this.next.station.y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
