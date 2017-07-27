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

  for(var i = 0; i < gm.stations.length; i++){
    gm.travelNodes.push(new TravelNode());
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

  gm.travelNodes[0].next = gm.travelNodes[1];
  gm.travelNodes[0].setStation(gm.stations[0]);

  gm.travelNodes[1].setStation(gm.stations[1]);
  gm.travelNodes[1].last = gm.travelNodes[0];
  gm.travelNodes[1].next = gm.travelNodes[2];

  gm.travelNodes[2].setStation(gm.stations[2]);
  gm.travelNodes[2].last = gm.travelNodes[1];

  gm.routes.black = new Route(gm.travelNodes[0]);


  gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.BLUE));
  gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.PURPLE));
  gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.ORANGE));
  gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.ORANGE));
  gm.stations[2].passengers.push(new Passenger(gm.stations[2], gm.colors.ORANGE));

  var start = gm.travelNodes[0];
  gm.trains.push(new Train(start.station.x, start.station.y, start))
}
