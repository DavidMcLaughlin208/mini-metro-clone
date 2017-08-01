var Route = function(color){
  this.head = null;
  this.color = color;
  this.tail = function(node){
    if(node.next === null){
      return node;
    } else {
      return this.tail(node.next)
    }
  }

  this.draw = function(ctx, node){
    if(node && node.next !== null){
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 20;

      ctx.beginPath();
      ctx.moveTo(node.station.x, node.station.y)
      ctx.lineTo(node.next.station.x, node.next.station.y);
      ctx.stroke();
      ctx.closePath();

      this.draw(ctx, node.next)
    } else {
      return;
    }
  }
}
