
var x = 0;
var y = 0;





document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);


function lockChangeAlert() {

  document.addEventListener("mousemove", updatePosition, false);

}



function updatePosition(e) {
  
  x += e.movementX;
  y += e.movementY;

  rotateCamera(e.movementX)

}
