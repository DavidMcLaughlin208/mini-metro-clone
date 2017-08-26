$(document).ready(function(){
  var gm = new GameManager();
  gm.metro.ctx.translate(gm.metro.width/2, gm.metro.height/2);

  var gameLoop = setInterval(gm.draw.bind(gm), 2)
  var passengerLoop = setInterval(gm.spawnPasenger.bind(gm), 4000);
  var stationLoop = setInterval(gm.spawnStation.bind(gm), 10000);
  createStations(gm);

  $("#pause").on("click", function(e){
    e.preventDefault();
    clearInterval(gameLoop);
    clearInterval(passengerLoop);
    clearInterval(stationLoop);
  })

  $("#play").on("click", function(e){
    e.preventDefault();
    clearInterval(gameLoop);
    clearInterval(passengerLoop);
    clearInterval(stationLoop);
    gameLoop = setInterval(gm.draw.bind(gm), 2);
    passengerLoop = setInterval(gm.spawnPasenger.bind(gm), 4000);
    stationLoop = setInterval(gm.spawnStation.bind(gm), 10000);
  })

  $("#updateItin").on("click", function(e){
    e.preventDefault();
    gm.allPassengersUpdateItinerary();
  })

  $("#printPassengers").on("click", function(e){
    e.preventDefault();
    var passengerTotal = 0;
    for(var i = 0; i < gm.stations.length; i++){
      var station = gm.stations[i];
      for(var j = 0; j < station.passengers.length; j++){
        var passenger = station.passengers[j];
        passengerTotal += 1;
        console.log(passenger);
      }
    }
    for(var i = 0; i < gm.trains.length; i++){
      var train = gm.trains[i];
      for(var j = 0; j < train.passengers.length; j++){
        var passenger = train.passengers[j];
        passengerTotal += 1;
        console.log(passenger);
      }
    }
    console.log(passengerTotal);
  })

  $("#metro").on("mousedown", function(e){
    var rect = this.getBoundingClientRect();
    var x = (e.clientX - rect.left) - gm.metro.width/2;
    var y = (e.clientY - rect.top) - gm.metro.height/2;
    for(var i = 0; i < gm.allRouteHandles.length; i++){
      var handle = gm.allRouteHandles[i];
      if(x <= handle.x + gm.clickBox && x >= handle.x - gm.clickBox && y <= handle.y + gm.clickBox && y >= handle.y - gm.clickBox){
        gm.connectingNode = handle.getNode();
        if(gm.connectingNode){
          console.log("Setting connectors")
          gm.connectingStation = handle.getNode().station;
          gm.connectingRoute = handle.route;
          gm.connectingHandle = handle;
          return;
        }
      }
    }
    for(var i = 0; i < gm.stations.length; i++){
      var station = gm.stations[i];
      if(x <= station.x + gm.clickBox && x >= station.x - gm.clickBox && y <= station.y + gm.clickBox && y >= station.y - gm.clickBox){
        console.log(station.connections)
        var route = null;
        for (var property in gm.routes) {
          if (gm.routes.hasOwnProperty(property) && gm.routes[property].head === null) {
            route = gm.routes[property];
            break;
          }
        }
        if(route){
          route.head = new TravelNode(gm.getTravelNodeId(), route);
          console.log("Creating new node")
          route.head.setStation(station);
          gm.connectingNode = route.head;
          gm.connectingRoute = route;
          gm.connectingStation = station;
          gm.connectingHandle = route.tailHandle;
          return;
        }
      }
    }
  })

  $("#metro").on("mouseup", function(e){
    var route = gm.connectingRoute;
    if(route && route.tail(route.head) === route.head){
      console.log("Not a valid route")
      route.deleteAllNodes();
    }
    gm.connectingNode = null;
    gm.connectingStation = null;
    gm.connectingRoute = null;
    gm.connectingHandle = null;
    console.log("mouseup")
  })

  $("#metro").on("mouseleave", function(e){
    gm.connectingNode = null;
    gm.connectingStation = null;
    var route = gm.connectingRoute;
    if(route && route.tail(route.head) === route.head){
      gm.connectingRoute.deleteAllNodes();
    }
    gm.connectingRoute = null;
    gm.connectingHandle = null;
    console.log("mouseleave")
  })

  $("#metro").on("mousemove", function(e){
    var rect = this.getBoundingClientRect();
    var x = (e.clientX - rect.left) - gm.metro.width/2;
    var y = (e.clientY - rect.top) - gm.metro.height/2;
    gm.mouseX = x;
    gm.mouseY = y;
    if(gm.connectingStation && gm.connectingRoute && gm.connectingNode){
      var isHovering = false;
      var newRoute = false;
      var route = gm.connectingRoute;
      if(route.tail(route.head) === route.head){
        newRoute = true;
      }
      for(var i = 0; i < gm.stations.length; i++){
        var station = gm.stations[i];
        if(x <= station.x + gm.clickBox && x >= station.x - gm.clickBox && y <= station.y + gm.clickBox && y >= station.y - gm.clickBox){
          isHovering = true;
          gm.hoverStation = station;
          if(gm.connectingStation !== this){
            var valid = gm.isValidConnection(gm.connectingRoute.head, station);
            if(valid){
              console.log("Valid connection")
              var node = new TravelNode(gm.getTravelNodeId(), gm.connectingRoute);
              console.log("Creating New Node")
              if(gm.connectingNode.next){
                node.next = gm.connectingRoute.head;
                node.setStation(station);
                gm.connectingRoute.head.last = node;
                gm.connectingRoute.head = node
              } else {
                node.setStation(station);
                var tail = gm.connectingRoute.tail(gm.connectingRoute.head);
                tail.next = node;
                node.last = tail;
              }
              gm.connectingNode = node;
              gm.connectingStation = node.station;
              if(newRoute){
                var anyTrainsOnRoute = gm.trains.some(function(arrVal) {
                  return arrVal.route === gm.connectingRoute;
                });
                if(!anyTrainsOnRoute){
                  console.log("NewRoute")
                  for(var i = 0; i < gm.trains.length; i++){
                    var train = gm.trains[i];
                    if(train.route === null){
                      train.setParams(gm.connectingRoute.head.station.x,
                                      gm.connectingRoute.head.station.y,
                                      gm.connectingRoute,
                                      gm.connectingRoute.head);
                      console.log(train)
                      break;
                    }
                  }
                }
              }
              gm.allPassengersUpdateItinerary();
            }
          }
        }
      }
      if(!isHovering && gm.hoverStation){
        var head = gm.connectingRoute.head;
        var tail = gm.connectingRoute.tail(gm.connectingRoute.head);
        if(gm.hoverStation === head.station && head.next && gm.connectingHandle === gm.connectingRoute.headHandle){
          var distanceX = Math.pow(head.station.x - head.next.station.x, 2);
          var distanceY = Math.pow(head.station.y - head.next.station.y, 2);
          var totalDistance = Math.sqrt(distanceX + distanceY);

          var newDistanceX = Math.pow(gm.mouseX - head.next.station.x, 2);
          var newDistanceY = Math.pow(gm.mouseY - head.next.station.y, 2);
          var newTotalDistance = Math.sqrt(newDistanceX + newDistanceY);
          console.log("Trying to remove head");
          if(newTotalDistance + gm.hoverStation.size/2 < totalDistance){
            console.log("Removing head")
            var route = gm.connectingRoute;
            console.log(gm.hoverStation.connections)
            var index = gm.hoverStation.connections.indexOf(head);
            if(index !== -1){
              gm.hoverStation.connections.splice(index, 1);
            }
            console.log(gm.hoverStation.connections)
            route.head = route.head.next;
            route.head.last.next = null;
            route.head.last = null;
            gm.connectingNode = route.head;
            gm.connectingStation = route.head.station;
          }
        } else if(gm.hoverStation === tail.station && tail.last && gm.connectingHandle === gm.connectingRoute.tailHandle){
          var distanceX = Math.pow(tail.station.x - tail.last.station.x, 2);
          var distanceY = Math.pow(tail.station.y - tail.last.station.y, 2);
          var totalDistance = Math.sqrt(distanceX + distanceY);

          var newDistanceX = Math.pow(gm.mouseX - tail.last.station.x, 2);
          var newDistanceY = Math.pow(gm.mouseY - tail.last.station.y, 2);
          var newTotalDistance = Math.sqrt(newDistanceX + newDistanceY);

          console.log("Trying to remove tail");
          if(newTotalDistance + gm.hoverStation.size/2 < totalDistance){
            console.log("Removing tail")
            var route = gm.connectingRoute;
            var connections = gm.hoverStation.connections;
            console.log(connections)
            connections.splice(connections.indexOf(tail), 1)
            console.log(connections)
            tail.last.next = null;
            tail.last = null;
            var newTail = route.tail(route.head);
            gm.connectingNode = newTail;
            gm.connectingStation = newTail.station;
          }
        }
        gm.hoverStation = null;
      }
    }
  })
})
