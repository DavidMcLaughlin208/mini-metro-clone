var Canvas = function(elementId, width, height){
  this.mycanvas = document.getElementById(elementId);
  this.ctx = document.getElementById(elementId).getContext('2d');
  this.width = width;
  this.height = height;
}
