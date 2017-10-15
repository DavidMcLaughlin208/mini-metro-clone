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
      ctx.moveTo(node.exitX, node.exitY)
      ctx.lineTo(node.next.midX, node.next.midY);
      ctx.stroke();
      ctx.lineTo(node.next.enterX, node.next.enterY);
      ctx.stroke();
      // ctx.lineTo(node.next.exitX, node.next.exitY);
      // ctx.stroke();
      ctx.closePath();

      this.draw(ctx, node.next, sizes)
    } else {
      return;
    }
  }

  this.drawHandle = function(node, handle, ctx, gm, drawNode, sizes){
    if(!drawNode){return}
    if(handle && node){
      var x1, x2, y1, y2;
      if(node.next){
        x1 = node.station.x;
        y1 = node.station.y;
        x2 = node.next.midX;
        y2 = node.next.midY;
      } else if(node.last){
        x1 = node.station.x;
        y1 = node.station.y;
        x2 = node.midX;
        y2 = node.midY;
      } else {
        return;
      }

      var distanceX = Math.abs(x1 - x2);
      var distanceY = Math.abs(y1 - y2);

      var normalizeFactor = Math.max(Math.abs(distanceX), Math.abs(distanceY));
      var normalizedX = (distanceX/normalizeFactor) * sizes.station.size * 1.5;
      var normalizedY = (distanceY/normalizeFactor) * sizes.station.size * 1.5;
      if(x1 < x2){
        normalizedX *= -1;
      }
      if(y1 > y2){
        normalizedY *= -1;
      }
      var x = x1 + normalizedX;
      var y = y1 - normalizedY;
      ctx.strokeStyle = this.color;

      var slope = (y1 - y2) / (x1 - x2);
      var rotation = Math.atan(slope);
      handle.draw(x, y, rotation, node.station, ctx, sizes);
    }
  }

  // this.alternateLanes = function() {
  //   if(!this.head || !this.head.next) {return}
  //   var node = this.head;
  //   var lane = node.lane;
  //   this.nextLane(node, lane)
  // }
  //
  // this.nextLane = function(node, lane) {
  //   if(node.next && !node.next.next) {
  //     node.next.lane = node.lane;
  //     return;
  //   }
  //   if(lane === "left") {
  //     node.lane = "right";
  //   } else if(lane === "right") {
  //     node.lane = "left";
  //   }
  //   if(node.next) {
  //     this.nextLane(node.next);
  //   }
  // }
}
