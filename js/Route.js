var Route = function(color){
  this.head = null;
  this.color = color;
  this.tail = function(node){
    if(node === null || node === undefined){return;}
    if(node.next === null){
      return node;
    } else {
      return this.tail(node.next)
    }
  }

  this.headHandle = new RouteHandle(this, "head");
  this.tailHandle = new RouteHandle(this, "tail");

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
      var distanceX = Math.abs(node.station.x - otherNode.station.x);
      var distanceY = Math.abs(node.station.y - otherNode.station.y);

      var normalizeFactor = Math.max(Math.max(Math.abs(distanceX), 1), Math.max(Math.abs(distanceY), 1));
      var normalizedX = (distanceX/normalizeFactor) * node.station.size * 1.5;
      var normalizedY = (distanceY/normalizeFactor) * node.station.size * 1.5;
      if(node.station.x < otherNode.station.x){
        normalizedX *= -1;
      }
      if(node.station.y > otherNode.station.y){
        normalizedY *= -1;
      }

      var slope = (otherNode.station.y - node.station.y) / (otherNode.station.x - node.station.x);
      var rotation = Math.atan(slope);
      ctx.strokeStyle = this.color;
      // if(handle.route.color === "#ff4444" && handle.route.headHandle === handle){
      //   console.log(normalizeFactor)
      //
      //   // console.log("x ", distanceX);
      //   // console.log("y ",distanceY);
      //
      //   // var distanceX = Math.pow(normalizedX, 2)
      //   // var distanceY = Math.pow(normalizedY, 2);
      //   // console.log(Math.sqrt(distanceY + distanceX));
      // }
      handle.draw(node.station.x + normalizedX, node.station.y - normalizedY, rotation, node.station, ctx);
    }
  }
}
