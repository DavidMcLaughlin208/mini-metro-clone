var Route = function(color){
  this.head = null;
  this.headHandle = new RouteHandle(this);
  this.tailHandle = new RouteHandle(this);
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
    if(handle){
      var othernode;
      if(node.next){
        otherNode = node.next;
      } else if(node.last){
        otherNode = node.last;
      }
      var distanceX = Math.pow(node.x - otherNode.x, 2);
      var distanceY = Math.pow(node.y - otherNode.y, 2);
      var totalDistance = Math.sqrt(distanceX + distanceY);

      var normalizeFactor = Math.max(Math.max(Math.abs(distanceX), 1), Math.max(Math.abs(distanceY), 1));
      var normalizedX = (distanceX/normalizeFactor) * node.station.size;
      var normalizedY = (distanceY/normalizeFactor) * node.station.size;

      var slope = (node.y - otherNode.y) / (node.x - otherNode.x);
      var rotation = Math.atan(slope) * 180/Math.PI;
      handle.draw(normalizedX, normalizedY, rotation, node.station, ctx)
    }
  }
}
