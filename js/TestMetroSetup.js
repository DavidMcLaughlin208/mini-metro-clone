var createStations = function(gm){
  gm.stations = [];
  gm.stations.push(new Station(-300, -100, '#4f83ff'))
  gm.stations.push(new Station(-100, -100, '#ff8644'))
  gm.stations.push(new Station(100, -100, '#ff4444'))
  gm.stations.push(new Station(300, -100, '#ff3feb'))

  gm.stations.push(new Station(300, 100, '#4f83ff'))
  gm.stations.push(new Station(100, 100, '#ff8644'))
  gm.stations.push(new Station(-100, 100, '#ff4444'))
  gm.stations.push(new Station(-300, 100, '#ff3feb'))

  gm.routes.black = new Route("Black");
  gm.routes.red = new Route("Red");

  for(var i = 0; i < 3; i++){
    gm.travelNodes.push(new TravelNode(gm.getTravelNodeId(), gm.routes.black));
  }

  for(var i = 0; i < 2; i++){
    gm.travelNodes.push(new TravelNode(gm.getTravelNodeId(), gm.routes.red));
  }

  // for(var i = 0; i < gm.stations.length; i++){
  //   if(i + 1 === gm.stations.length){
  //     gm.travelNodes[i].next = gm.travelNodes[0];
  //   }else{
  //     gm.travelNodes[i].next = gm.travelNodes[i + 1];
  //   }

  //   gm.travelNodes[i].station = gm.stations[i];

  //   if(i == 0){
  //     gm.travelNodes[i].last = gm.travelNodes[gm.stations.length - 1];
  //   }else{
  //     gm.travelNodes[i].last = gm.travelNodes[i - 1];
  //   }
  // }

  gm.travelNodes[0].setStation(gm.stations[0]);
  gm.travelNodes[0].next = gm.travelNodes[1];
  gm.routes.black.head = gm.travelNodes[0]

  gm.travelNodes[1].setStation(gm.stations[1]);
  gm.travelNodes[1].last = gm.travelNodes[0];
  gm.travelNodes[1].next = gm.travelNodes[2];

  gm.travelNodes[2].setStation(gm.stations[2]);
  gm.travelNodes[2].last = gm.travelNodes[1];

  gm.travelNodes[3].setStation(gm.stations[2]);
  gm.travelNodes[3].next = gm.travelNodes[4];
  gm.routes.red.head = gm.travelNodes[3]

  gm.travelNodes[4].setStation(gm.stations[3]);
  gm.travelNodes[4].last = gm.travelNodes[3];

  var start = gm.travelNodes[0];
  gm.trains.push(new Train(start.station.x, start.station.y, start))

  gm.stations[2].passengers.push(new Passenger(gm.stations[3], gm.colors.BLUE));
  // gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.PURPLE));
  // gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.ORANGE));
  // gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.ORANGE));
  // gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.ORANGE));

}
