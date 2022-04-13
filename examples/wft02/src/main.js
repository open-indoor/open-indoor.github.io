

var GameParam ={

  playerSpeed:30, //[0,100]  =>50 par defaut
  rotationSpeedMultiplier:50, //[0,100]  =>50 par defaut
  rotationSens:1,
  Collision:1,


  munIn:0,
  munOut:0,
  chargeur:0,
  arme : 0,


  pause : 0,
  touchePause:80,

//////////////////////
  stepSize  :  0.000003,//0.0000051
  stepSizeMax:0.000008,
  stepSizeMin:0.0000005,

  rotationSpeed:0.005,// rotationSpeed--  => plus rapide (1 plus rapide que 10)
  rotationSpeedMax:0.0015,
  rotationSpeedMin:0.015,

}





var tirVide = new Audio('audio/armeVide.mp3'); 
 
var tempoTir = 1;
var tempoPorte = 1;

function start(data){

  CameraParam.stepSize=GameParam.stepSize;
  CameraParam.rotationSpeed=GameParam.rotationSpeed;

  correctionResize()
  setCursorPosition();
  paramOn();
  //ttt();

  var y = document.getElementById("ammo");
  y.innerHTML=GameParam.munIn;


  let BuildingTextures = {
      type: "FeatureCollection",
      features: data.features.filter(feat_ => ('IMGtexture' in feat_.properties))
  }
  

  document.addEventListener('click', function (e){
    if(tempoTir == 1 && GameParam.arme!=0){
      if(GameParam.munIn<1){
        GameParam.munIn=0;
        
        tirVide.play();
      }else{
        click(getCenterScreen())
        tir();   
        
      }
    }
    
  });

  
  

 

    map.addSource('floorplan', {
        
        'type': 'geojson',
        'data': data
    });

    map.addSource('floorplanTexture', {
        
        'type': 'geojson',
        'data': BuildingTextures
    });

    

    
    

    map.addLayer({
        'id': 'room-extrusion',
        'type': 'fill-extrusion',
        'source': 'floorplan',
        'paint': {

        'fill-extrusion-color': ['get', 'color'],
        
        'fill-extrusion-height': ['get', 'height'],
        
        'fill-extrusion-base': ['get', 'base_height'],
        
        'fill-extrusion-opacity': 0.5
        }

    });

    
    loadTexture();
    addTextures();
    addCible(data)

    initializeFirstPersonCamera(map);
    //chargeMap();
    //resetFirstPersonCamera(map)
}


function chargeMap(){

  var d = document.getElementById("armediv1");
  d.style.backgroundImage="url('textures/n.png')";

  var ti=4;
  for(var i=0;i<435*2;i++){
    setTimeout(function(){rotateCamera(20)}, ti*i); 
  }
  setTimeout(function(){d.style.backgroundImage=null;}, ti*440*2);
  
}












function getCenterScreen(){

  var coordCenter = {
    x : window.innerWidth/2,
    y : window.innerHeight/2
  }
  return(coordCenter)
}


function setCursorPosition(){
  var cursor = document.getElementById("cursor");///
  cursor.style.left = (getCenterScreen().x-25) + "px";
  cursor.style.top = (getCenterScreen().y/1.3-25) + "px";
}

function correctionResize(){
 
  var d = document.getElementById("calcArme");

  switch (GameParam.arme) {
    case 0:
      d.style.backgroundImage="url('textures/main.png')";
      break;
    case 1:
      d.style.backgroundImage="url('textures/arme.png')";
      break;
    default:
      d.style.backgroundImage="url('textures/main.png')";
  }
    
    d.style.width = getCenterScreen().y*1.5 +"px",
    d.style.height = getCenterScreen().y*1.5 +"px"
    setCursorPosition()
  
}



const click = (coordCenter) => {
  delayTir()
  const ev = new PointerEvent('click', {
    'bubbles': true,
    'cancelable': true,
    'clientX': coordCenter.x,
    'clientY': coordCenter.y*0.8,
    'type': "click",
    'view': window,
    'pointerType': "mouse",
  });
  const el = document.elementFromPoint(coordCenter.x, coordCenter.y*0.8);
  el.dispatchEvent(ev);

  
}

function delayTir(){
  tempoTir = 0;
  setTimeout(function(){tempoTir = 1}, 10);

}

function delayPorte(){
  tempoPorte = 0;
  setTimeout(function(){tempoPorte = 1}, 2000);

}


window.addEventListener('mousemove',function(e){
  if(GameParam.pause==0){

    var dx = -50+(e.clientX * 100)/window.innerWidth
    var r = (dx*10)/50

    var d = document.getElementById("calcArme");
    //d.style.transform = "translateX("+dx*2+"%) rotateZ("+r+"deg)"
    
    

 
  }
});

window.addEventListener('resize', correctionResize);







function tir(){
  if(GameParam.pause==0){
  
    var d = document.getElementById("calcArme");
    d.style.backgroundImage="url('./textures/armeTir01.png')"
    var tir = new Audio('audio/tir01.mp3');
    tir.play();
    var y = document.getElementById("ammo");
    GameParam.munIn--; 
    y.innerHTML=GameParam.munIn+'/'+GameParam.munOut;
    var ti=20;
    setTimeout(function(){d.style.backgroundImage="url('./textures/armeTir02.png')"}, ti); 
    setTimeout(function(){d.style.backgroundImage="url('./textures/armeTir03.png')"}, ti*2); 
    setTimeout(function(){d.style.backgroundImage="url('./textures/armeTir04.png')"}, ti*3); 
    setTimeout(function(){d.style.backgroundImage="url('./textures/armeTir05.png')"}, ti*4); 
    setTimeout(function(){d.style.backgroundImage="url('./textures/arme.png')"}, ti*5); 

    if(GameParam.munIn==0 && GameParam.munOut>0){
      setTimeout(function(){d.style.backgroundImage="url('./textures/main.png')"}, ti*6);
      setTimeout(function(){
        if(GameParam.munOut>=GameParam.chargeur){
          GameParam.munIn=GameParam.chargeur;
          GameParam.munOut-=GameParam.chargeur;
        }else{
          GameParam.munIn=GameParam.munOut;
          GameParam.munOut=0;
        }
        
        y.innerHTML=GameParam.munIn+'/'+GameParam.munOut;
        var sound = new Audio('audio/rechargeGun.mp3');
        sound.play();
      }, 500);
      setTimeout(function(){d.style.backgroundImage="url('./textures/arme.png')"}, 1000);
    }
  }
}



function openDoor(t){
  if(GameParam.pause==0){

    if(tempoPorte == 1){
      delayPorte()
        var ti=50;

        var door = new Audio('audio/porte01.mp3');
        door.play();
          if(t.implementation.scene.position.x<0){

            for(var i=0; i<30; i++){
              setTimeout(function(){t.implementation.scene.position.x+=0.1}, ti*i);
            }
          }else{
        
          for(var i=0; i<30; i++){
            setTimeout(function(){t.implementation.scene.position.x-=0.1}, ti*i);
          }
        }
    }  
  }
}




function killCible(marker){
  if(GameParam.pause==0){
    if(GameParam.munIn>0 && GameParam.arme!=0){
        var death01 = new Audio('audio/death01.mp3'); 
        map.removeLayer("c"+marker.properties.cible)
        var t= map.getLayer(marker.properties.cible);
        if(t!=undefined){

            map.removeLayer(marker.properties.cible)
            death01.play();
            console.log(marker.properties.cible+" is dead")
            var y = document.getElementById("score");
            var scoreval=parseInt(y.innerHTML);
            y.innerHTML=scoreval+marker.properties.score;
        }
    }
  }
}




function pickUpOBJ(marker,id){
  if(GameParam.pause==0){

    if(id==null)id="";

    switch(marker.properties.type){

      case "gun":
        var sound = new Audio('audio/rechargeGun.mp3');
        sound.play();

        map.removeLayer("obj"+marker.properties.obj+id)
        var t= map.getLayer(marker.properties.obj+id);

        if(t!=undefined){

          map.removeLayer(marker.properties.obj+id)

          console.log(marker.properties.obj+id+" was picked up")
          GameParam.chargeur = marker.properties.magazineCap;
          GameParam.arme=1;
          GameParam.munIn = GameParam.chargeur;
          GameParam.munOut = marker.properties.mun-GameParam.chargeur;
          var y = document.getElementById("ammo");
          var img = document.getElementById("gunPic");
          
          setTimeout(function(){
            correctionResize();
            y.innerHTML=GameParam.munIn+'/'+GameParam.munOut;
            img.style.backgroundImage="url('textures/gun.png')";
          }, 500);      

        }
        break;
      case "munition":

        var sound = new Audio('audio/rechargeGun.mp3');
        sound.play();

        map.removeLayer("obj"+marker.properties.obj+id)
        var t= map.getLayer(marker.properties.obj+id);

        if(t!=undefined){

          map.removeLayer(marker.properties.obj+id)

          console.log(marker.properties.obj+id+" was picked up")
          GameParam.munOut += marker.properties.mun;
          var ammo = document.getElementById("ammo");
          var score = document.getElementById("score");
          var scoreval=parseInt(score.innerHTML);
        
          ammo.innerHTML=GameParam.munIn+'/'+GameParam.munOut;    
          score.innerHTML=scoreval+marker.properties.score;

        }

        break;
      case "point":

        var sound = new Audio('audio/point.mp3');
        sound.play();

        map.removeLayer("obj"+marker.properties.obj+id)
        var t= map.getLayer(marker.properties.obj+id);

        if(t!=undefined){

          map.removeLayer(marker.properties.obj+id)

          console.log(marker.properties.obj+id+" was picked up")
    
        
          var score = document.getElementById("score");
          var scoreval=parseInt(score.innerHTML);
          
          score.innerHTML=scoreval+marker.properties.score;

        }

        break;

    }
    
        
        
  }   
    
}



function paramOn(){
  document.exitPointerLock();
  var paramMenu = document.getElementById("menuParam");
  var PlayerSpeed = document.getElementById("PlayerSpeed");
  var RotationSpeed = document.getElementById("RotationSpeed");
  var ReverseRotation = document.getElementById("ReverseRotation");
  var Collision = document.getElementById("Collision");

  var Up = document.getElementById("Up");
  var Down = document.getElementById("Down");
  var Right = document.getElementById("Right");
  var Left = document.getElementById("Left");
  var touchePause = document.getElementById("touchePause");


  if(GameParam.pause==0){

    pauseGame();

    RotationSpeed.value=GameParam.rotationSpeedMultiplier;
    PlayerSpeed.value=GameParam.playerSpeed;
    if(GameParam.Collision==1){Collision.checked=true}else{Collision.checked=false}
    if(GameParam.ReverseRotation==1){ReverseRotation.checked=true}else{ReverseRotation.checked=false}
 





    paramMenu.style.width="400px";
    paramMenu.style.height="400px";
    paramMenu.style.visibility="visible";


  }else {

    GameParam.rotationSpeedMultiplier = RotationSpeed.value;
    GameParam.playerSpeed = PlayerSpeed.value;

    var pasRotation = (GameParam.rotationSpeedMin-GameParam.rotationSpeedMax)/100;
    var pasStepSize = (GameParam.stepSizeMin-GameParam.stepSizeMax)/100;
    CameraParam.rotationSpeed = GameParam.rotationSpeedMin - pasRotation*GameParam.rotationSpeedMultiplier;
    CameraParam.stepSize = GameParam.stepSizeMin - pasStepSize*GameParam.playerSpeed;
    


    if(ReverseRotation.checked==true){GameParam.rotationSens=-1}else{GameParam.rotationSens=1};
    if(Collision.checked==true){GameParam.Collision=1}else{GameParam.Collision=0};

    CameraParam.collision=GameParam.Collision;

    CameraParam.keyUp[1]=Up.value.toUpperCase().charCodeAt(0)
    CameraParam.keyDown[1]=Down.value.toUpperCase().charCodeAt(0)
    CameraParam.keyRight[1]=Right.value.toUpperCase().charCodeAt(0)
    CameraParam.keyLeft[1]=Left.value.toUpperCase().charCodeAt(0)

    GameParam.touchePause=touchePause.value.toUpperCase().charCodeAt(0)

    //CameraParam.stepSize=0.000008;
    //alert(CameraParam.stepSize)
    startGame()
    

    paramMenu.style.width="0px";
    
    paramMenu.style.height="0px";
    paramMenu.style.visibility="hidden";

    //alert(document.param.PlayerSpeed.value)



  }

  

  

}


document.addEventListener('keydown', function (e){

  if(e.keyCode==GameParam.touchePause){

    paramOn()         

  }

});





function pauseGame(){
  //document.exitPointerLock();
  
  GameParam.pause=1;
  CameraParam.rotationSens=0;
  CameraParam.stepSize=0;
}

function startGame(){
  var canvas = document.querySelector('canvas');
  delayTir();
  delayPorte();
  GameParam.pause=0;
  CameraParam.rotationSens=GameParam.rotationSens;
  canvas.requestPointerLock();
  //CameraParam.stepSize=0.000003;
}


















function loadTexture(){

  map.loadImage(
    "./textures/diamond.png",
    (error, image) => {
      map.addImage("IMGdiamond", image , {pixelRatio:2});
    }
  );

  map.loadImage(
    "textures/murBleu.png",
    (error, image) => {
      map.addImage("IMGmurBleu", image , {pixelRatio:2});
    }
  );

  map.loadImage(
    "textures/murMarron.png",
    (error, image) => {
      map.addImage("IMGmurMarron", image , {pixelRatio:2});
    }
  );

  map.loadImage(
    "textures/murRouge.png",
    (error, image) => {
      map.addImage("IMGmurRouge", image , {pixelRatio:2});
    }
  );

  map.loadImage(
    "textures/murGris.png",
    (error, image) => {
      map.addImage("IMGmurGris", image , {pixelRatio:2});
    }
  );  
  
  map.loadImage(
    "textures/sol01.png",
    (error, image) => {
      map.addImage("IMGsol01", image , {pixelRatio:1});
    }
  ); 

  
}

