$(document).ready(function(){
  var gm = new GameManager();
  gm.metro = new Canvas('metro', 1000, 700);
  gm.metro.ctx.fillStyle = 'black';
  gm.metro.ctx.fillRect(0, 0, gm.metro.width, gm.metro.height);
})
