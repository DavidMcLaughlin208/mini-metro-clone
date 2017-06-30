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
    if(i + 1 === gm.stations.length){
      gm.stations[i].next = gm.stations[0];
    }else{
      gm.stations[i].next = gm.stations[i + 1];
    }

    if(i == 0){
      gm.stations[i].last = gm.stations[gm.stations.length - 1];
    }else{
      gm.stations[i].last = gm.stations[i - 1];
    }
  }
  var start = gm.stations[0];
  gm.trains.push(new Train(start.x, start.y, start))
}
