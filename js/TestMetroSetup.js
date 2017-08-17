var createStations = function(gm){
  gm.stations = [];
  gm.stations.push(new Station(-350, -120, "square"))
  gm.stations.push(new Station(-100, -150, "triangle"))
  gm.stations.push(new Station(130, -130, "teardrop"))
  gm.stations.push(new Station(320, -140, "diamond"))

  gm.stations.push(new Station(300, 100, "circle"))
  gm.stations.push(new Station(100, 100, "square"))
  gm.stations.push(new Station(-100, 100, "plus"))
  gm.stations.push(new Station(-300, 100, "circle"))

  // for(var i = 0; i < 3; i++){
  //   gm.travelNodes.push(new TravelNode(gm.getTravelNodeId(), gm.routes.red));
  // }
  //
  // for(var i = 0; i < 2; i++){
  //   gm.travelNodes.push(new TravelNode(gm.getTravelNodeId(), gm.routes.blue));
  // }

  // gm.travelNodes[0].setStation(gm.stations[0]);
  // gm.travelNodes[0].next = gm.travelNodes[1];
  // gm.routes.red.head = gm.travelNodes[0]
  //
  // gm.travelNodes[1].setStation(gm.stations[1]);
  // gm.travelNodes[1].last = gm.travelNodes[0];
  // gm.travelNodes[1].next = gm.travelNodes[2];
  //
  // gm.travelNodes[2].setStation(gm.stations[2]);
  // gm.travelNodes[2].last = gm.travelNodes[1];
  //
  // gm.travelNodes[3].setStation(gm.stations[2]);
  // gm.travelNodes[3].next = gm.travelNodes[4];
  // gm.routes.blue.head = gm.travelNodes[3]
  //
  // gm.travelNodes[4].setStation(gm.stations[3]);
  // gm.travelNodes[4].last = gm.travelNodes[3];

  // var start = gm.travelNodes[0];
  // gm.trains.push(new Train(start.station.x, start.station.y, start, gm.routes.red))
  // start = gm.travelNodes[3];
  // gm.trains.push(new Train(start.station.x, start.station.y, start, gm.routes.blue))

  // gm.stations[2].passengers.unshift(new Passenger(gm.stations[2], "triangle"));
  // gm.stations[2].passengers.unshift(new Passenger(gm.stations[2], "square"));
  // gm.stations[2].passengers.unshift(new Passenger(gm.stations[2], "plus"));
  gm.stations[0].passengers.unshift(new Passenger(gm.stations[0], "circle"));
  // gm.stations[2].passengers.unshift(new Passenger(gm.stations[2], "square"));


}
