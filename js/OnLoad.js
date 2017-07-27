$(document).ready(function(){  
  var gm = new GameManager();
  gm.metro.ctx.translate(gm.metro.width/2, gm.metro.height/2);

  var gameLoop = setInterval(gm.draw.bind(gm), 2)
  createStations(gm)

  $("#metro").on("mousedown", function(e){
    var rect = this.getBoundingClientRect();
    var x = (e.clientX - rect.left) - gm.metro.width/2;
    var y = (e.clientY - rect.top) - gm.metro.height/2;
    for(var i = 0; i < gm.stations.length; i++){
      var station = gm.stations[i];
      if(x <= station.x + 50 && x >= station.x - 50 && y <= station.y + 50 && y >= station.y - 50){
        gm.connectingNode = gm.headOrTail(station, gm.routes.black)
        if(gm.connectingNode){
          gm.connectingStation = station;
          break;
        }
      }
    }
  })

  $("#metro").on("mouseup", function(e){
    var rect = this.getBoundingClientRect();
    var x = (e.clientX - rect.left) - gm.metro.width/2;
    var y = (e.clientY - rect.top) - gm.metro.height/2;
    for(var i = 0; i < gm.stations.length; i++){
      var station = gm.stations[i];
      if(x <= station.x + 50 && x >= station.x - 50 && y <= station.y + 50 && y >= station.y - 50){
        if(gm.connectingStation !== this){
          var valid = gm.isValidConnection(gm.routes.black.head, station);
          if(valid){
            console.log("Valid connection")
            if(gm.connectingNode.next){
              var node = new TravelNode();
              node.next = gm.routes.black.head;
              node.setStation(station);
              gm.routes.black.head.last = node;
              gm.routes.black.head = node
            } else {
              var node = new TravelNode();
              node.setStation(station);
              var tail = gm.routes.black.tail(gm.routes.black.head);
              tail.next = node;
              node.last = tail;
            }
          }
        }
      }
    }
    gm.connectingStation = null;
    console.log("mouseup")
  })

  $("#metro").on("mouseleave", function(e){
    gm.connectingStation = null;
    console.log("mouseleave")
  })

  $("#metro").on("mousemove", function(e){
    var rect = this.getBoundingClientRect();
    gm.mouseX = (e.clientX - rect.left) - gm.metro.width/2;
    gm.mouseY = (e.clientY - rect.top) - gm.metro.height/2;
  })
})
