var createStations = function(gm){
  gm.stations = [];
  gm.stations.push(new Station(150, 200, '#4f83ff'))
  gm.stations.push(new Station(350, 200, '#ff8644'))
  gm.stations.push(new Station(550, 200, '#ff4444'))
  gm.stations.push(new Station(750, 200, '#ff3feb'))

  gm.stations.push(new Station(750, 400, '#4f83ff'))
  gm.stations.push(new Station(550, 400, '#ff8644'))
  gm.stations.push(new Station(350, 400, '#ff4444'))
  gm.stations.push(new Station(150, 400, '#ff3feb'))

  for(var i = 0; i < gm.stations.length; i++){
    gm.travelNodes.push(new TravelNode());
  }

  for(var i = 0; i < gm.stations.length; i++){
    if(i + 1 === gm.stations.length){
      gm.travelNodes[i].next = gm.travelNodes[0];
    }else{
      gm.travelNodes[i].next = gm.travelNodes[i + 1];
    }

    gm.travelNodes[i].station = gm.stations[i];

    if(i == 0){
      gm.travelNodes[i].last = gm.travelNodes[gm.stations.length - 1];
    }else{
      gm.travelNodes[i].last = gm.travelNodes[i - 1];
    }
  }
  var start = gm.travelNodes[0];
  gm.trains.push(new Train(start.station.x, start.station.y, start))
}
