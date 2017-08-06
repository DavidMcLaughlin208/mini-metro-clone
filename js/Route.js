var Route = function(color){
  this.head = null;
  this.headHandle = new RouteHandle(this);
  this.tailHandle = new RouteHandle(this);
  this.color = color;
  this.tail = function(node){
    if(node === null){return;}
    if(node.next === null){
      return node;
    } else {
      return this.tail(node.next)
    }
  }

  this.draw = function(ctx, node){
    if(node && node.next !== null){
      ctx.strokeStyle = this.color;
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

  this.drawHandle = function(node, handle, ctx){
    if(handle && node){
      var othernode;
      if(node.next){
        otherNode = node.next;
      } else if(node.last){
        otherNode = node.last;
      }
      var distanceX = Math.pow(node.station.x - otherNode.station.x, 2);
      var distanceY = Math.pow(node.station.y - otherNode.station.y, 2);
      var totalDistance = Math.sqrt(distanceX + distanceY);

      var normalizeFactor = Math.max(Math.max(Math.abs(distanceX), 1), Math.max(Math.abs(distanceY), 1));
      var normalizedX = (distanceX/normalizeFactor) * node.station.size * 1.5;
      var normalizedY = (distanceY/normalizeFactor) * node.station.size * 1.5;
      if(node.station.x < otherNode.station.x){
        normalizedX *= -1;
      }
      if(node.station.y > otherNode.station.y){
        normalizedY *= -1;
      }

      var slope = (node.station.y - otherNode.station.y) / (node.station.x - otherNode.station.x);
      var rotation = Math.atan(slope) * 180/Math.PI;
      handle.draw(node.station.x + normalizedX, node.station.y - normalizedY, rotation, node.station, ctx)
    }
  }
}
