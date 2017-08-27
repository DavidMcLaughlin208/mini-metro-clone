var Route = function(color, sizeRatio){
  this.color = color;
  this.head = null;
  this.tail = function(node){
    if(node === null || node === undefined){return;}
    if(node.next === null){
      return node;
    } else {
      return this.tail(node.next)
    }
  }

  this.deleteAllNodes = function(){
    var headNode = this.head;
    this.head = null;
    this.deleteNext(headNode);
  }

  this.deleteNext = function(node){
    if(node === null || node === undefined){return}
    var nextNode = node.next;
    node.delete();
    if(nextNode){
      this.deleteNext(nextNode);
    }
  }

  this.headHandle = new RouteHandle(this, "head");
  this.tailHandle = new RouteHandle(this, "tail");

  this.draw = function(ctx, node, sizes){
    var lineWidth = sizes.route.lineWidth;
    if(node && node.next !== null){
      ctx.strokeStyle = this.color;
      ctx.lineWidth = lineWidth;

      ctx.beginPath();
      ctx.moveTo(node.station.x, node.station.y)
      ctx.lineTo(node.next.station.x, node.next.station.y);
      ctx.stroke();
      ctx.closePath();

      this.draw(ctx, node.next, sizes)
    } else {
      return;
    }
  }

  this.drawHandle = function(node, handle, ctx, gm, drawNode, sizes){
    if(handle && node){
      var targetX;
      var targetY;
      var distanceX;
      var distanceY;
      if(drawNode){
        var othernode;
        if(node.next){
          otherNode = node.next;
        } else if(node.last){
          otherNode = node.last;
        } else {
          return;
        }
        targetX = otherNode.station.x;
        targetY = otherNode.station.y;
      } else {
        targetX = gm.mouseX;
        targetY = gm.mouseY;
      }
      distanceX = Math.abs(node.station.x - targetX);
      distanceY = Math.abs(node.station.y - targetY);

      var normalizeFactor = Math.max(Math.max(Math.abs(distanceX), 1), Math.max(Math.abs(distanceY), 1));
      var normalizedX = (distanceX/normalizeFactor) * sizes.station.size * 1.5;
      var normalizedY = (distanceY/normalizeFactor) * sizes.station.size * 1.5;
      if(node.station.x < targetX){
        normalizedX *= -1;
      }
      if(node.station.y > targetY){
        normalizedY *= -1;
      }
      var x;
      var y;
      if(drawNode){
        x = node.station.x + normalizedX;
        y = node.station.y - normalizedY;
      } else {
        x = gm.mouseX;
        y = gm.mouseY;
      }
      ctx.strokeStyle = this.color;

      var slope = (targetY - node.station.y) / (targetX - node.station.x);
      var rotation = Math.atan(slope);
      handle.draw(x, y, rotation, node.station, ctx, drawNode, sizes);
    }
  }
}
