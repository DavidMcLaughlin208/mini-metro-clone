$(document).ready(function(){  
  var gm = new GameManager();

  //gm.metro = new Canvas('metro', 900, 600);
  //gm.metro.ctx.fillStyle = '#f2f6ff';
  //gm.metro.ctx.fillRect(0, 0, gm.metro.width, gm.metro.height);
  //var station = new Station(gm.metro.width/2, gm.metro.height/2, '#4f83ff');
  //station.draw(gm.metro.ctx);

  var gameLoop = setInterval(gm.draw.bind(gm), 2)
  createStations(gm)

  $("#metro").on("mousedown", function(e){
    var rect = this.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
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
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
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
              node.station = station;
              gm.routes.black.head.last = node;
              gm.routes.black.head = node
            } else {
              var node = new TravelNode();
              node.station = station;
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
    gm.mouseX = e.clientX - rect.left;
    gm.mouseY = e.clientY - rect.top;
  })
})
