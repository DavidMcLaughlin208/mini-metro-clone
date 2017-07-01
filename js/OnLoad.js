$(document).ready(function(){  
  var gm = new GameManager();
  //gm.metro = new Canvas('metro', 900, 600);
  //gm.metro.ctx.fillStyle = '#f2f6ff';
  //gm.metro.ctx.fillRect(0, 0, gm.metro.width, gm.metro.height);
  //var station = new Station(gm.metro.width/2, gm.metro.height/2, '#4f83ff');
  //station.draw(gm.metro.ctx);

  var gameLoop = setInterval(gm.draw.bind(gm), 2)
  createStations(gm)
})
