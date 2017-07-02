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
        console.log("nearvy station")
        var hot = gm.headOrTail(station, gm.routes.black)
        console.log(hot)
        if(hot){
          gm.connectingStation = station;
          console.log(station);
          break;
        }
      }
      console.log("mousedown")
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
