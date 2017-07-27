var Passenger = function(station, color){
  this.station = station;
  this.color = color;
  this.train = null;
  this.state = "station";
  this.size = 7;
  this.itinerary = [];

  this.draw = function(ctx, index){
    switch(this.state) {
    case "station":
      ctx.beginPath();
      ctx.arc(this.calcX(index), this.calcY(index), this.size, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      break;
    case "train":

      break
    default:
      break;
    }
  }

  this.boardTrain = function(queue, route, itinerary, addToItinerary){
    itinerary = (itinerary === null) ? [] : itinerary;
    if(addToItinerary){
      itinerary.push({route: route, station: queue})
    }
    for(var i in queue){
      var localQueue = [];
      var stationNodes = queue[i].station.travelNodes;
      stationNodes = stationNodes.filter(function(travelNode){
        travelNode.checked === false;
      })
      for(var j in stationNodes){
        if(stationNodes[j].route === route){
          var newQueue = [];
          if(stationNodes[j].next.checked === false){newQueue.push(stationNodes[j].next);}
          if(stationNodes[j].last.checked === false){newQueue.push(stationNodes[j].last);}
          this.boardTrain(newQueue, route, itinerary);
        }
      }
      for(var j in stationNodes){
        if(stationNodes[j].route !== route){
          var newQueue = [];
          if(stationNodes[j].next.checked === false){newQueue.push(stationNodes[j].next);}
          if(stationNodes[j].last.checked === false){newQueue.push(stationNodes[j].last);}
          this.boardTrain(newQueue, stationNodes[j].route, itinerary);
        }
      }
    }
  }

  this.calcX = function(index){
    return this.station.x - this.station.size + index * this.size * 2;
  }
  this.calcY = function(index){
    // var multiplier = 1;
    // var rows = 1 + index;
    // while(rows > 4){
    //   rows -= 4;
    //   multiplier += 1;
    // }
    return this.station.y - this.station.size - this.size;
  }
}
