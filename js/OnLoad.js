$(document).ready(function(){
  var gm = new GameManager();
  gm.metro.ctx.translate(gm.metro.width/2, gm.metro.height/2);

  var gameLoop = setInterval(gm.draw.bind(gm), 2)
  createStations(gm)

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
        var route = null;
        for (var property in gm.routes) {
          if (gm.routes.hasOwnProperty(property) && gm.routes[property].head === null) {
            route = gm.routes[property];
            break;
          }
        }
        if(route){
          route.head = new TravelNode(gm.getTravelNodeId(), route);
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
    var rect = this.getBoundingClientRect();
    var x = (e.clientX - rect.left) - gm.metro.width/2;
    var y = (e.clientY - rect.top) - gm.metro.height/2;
    if(gm.connectingStation && gm.connectingRoute && gm.connectingNode){
      for(var i = 0; i < gm.stations.length; i++){
        var station = gm.stations[i];
        if(x <= station.x + gm.clickBox && x >= station.x - gm.clickBox && y <= station.y + gm.clickBox && y >= station.y - gm.clickBox){
          if(gm.connectingStation !== this){
            var valid = gm.isValidConnection(gm.connectingRoute.head, station);
            if(valid){
              console.log("Valid connection")
              var node = new TravelNode(gm.getTravelNodeId(), gm.connectingRoute);
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
            }
          }
        }
      }
      var route = gm.connectingRoute;
      if(route.tail(route.head) === route.head){
        console.log("Not a valid route")
        route.deleteAllNodes();
      }
      gm.connectingNode = null;
      gm.connectingStation = null;
      gm.connectingRoute = null;
      gm.connectingHandle = null;
    }
    console.log("mouseup")
  })

  $("#metro").on("mouseleave", function(e){
    gm.connectingNode = null;
    gm.connectingStation = null;
    gm.connectingRoute = null;
    gm.connectingHandle = null;
    console.log("mouseleave")
  })

  $("#metro").on("mousemove", function(e){
    var rect = this.getBoundingClientRect();
    gm.mouseX = (e.clientX - rect.left) - gm.metro.width/2;
    gm.mouseY = (e.clientY - rect.top) - gm.metro.height/2;
  })
})
