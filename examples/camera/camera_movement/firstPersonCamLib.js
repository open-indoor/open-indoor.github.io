


  var CameraParam = { // parametres de rotation et de mouvement de la camera

    zoom : 20,

    cameraPremierePersonne : 0, // vue ordinaire ou en 1er personne

    positionRotationX : 0, // position deplacement total
    XmousePositionSaved : 0, // derniere position de la souris en X

    rotationSpeed : 0.025, // rotationSpeed--  => plus rapide (1 plus rapide que 10)
    FirstMouseMoveSkiped : 0, // bloquer le premier mouvement de souris

    x0  :  0, // coordonnees X du centre 
    y0  :  0, // coordonnees y du centre 

    positionRightingRadius  :  0.00018,//20 0.0006 //24 0.00018

    stepSize  :  0.00001, // distance parcourue en un pas

    keyUp : [38,90,87], // avancer
    keyDown : [40,83,83], // reculer
    keyRight  : [39,68,68], // aller a droite
    keyLeft : [37,81,65], // aller a gauche

    keyToChangeViewMode : 67, // touche pour changer de mode de vue

  };


  function CorrectionLatitude(){
    
      var lat =  map.getCenter().lat
      if(lat<60){
        var p = Math.exp((lat-59.5)*0.056)+1;

      }else{
        var p = Math.exp((lat-63)*0.09)+1.19;

      }
      return p;

  }


  function correctionZoom(){   
    
    var lat =  map.getCenter().lat
    if(lat<60){
      CameraParam.zoom = Math.log(window.innerHeight)*1.425+(13.58)-CorrectionLatitude();

    }else{
      CameraParam.zoom = Math.log(window.innerHeight)*1.425+(13.58)-(Math.exp((map.getCenter().lat-50)*0.033)+0.552);

    }
    map.setZoom(CameraParam.zoom);

  }


  function getBearingRadian(){
    
    var northAngle = map.getBearing();
      
    if(northAngle<0)northAngle=360+northAngle;

    northAngle = (northAngle) * (Math.PI/180);

    return northAngle;

  }





  function initializeFirstPersonCamera(map,coord={lng : -1000, lat : -1000}){//coord=[lng,lat] ou coord={lng:val , lat:val}

    if(coord.lng==undefined){
      var coord={
        lng : coord[0],
        lat : coord[1]      
      }
    }

    disableMapControls();
    map.setMaxZoom(24);
    

    if(coord.lat ==-1000 && coord.lng ==-1000){
      CameraParam.x0 = map.getCenter().lng;
      CameraParam.y0 = map.getCenter().lat;
    }else {
      CameraParam.x0 = coord.lng;
      CameraParam.y0 = coord.lat;
    }
    
    CameraParam.positionRotationX = 0;
    CameraParam.XmousePositionSaved = 0;
    CameraParam.FirstMouseMoveSkiped = 0;

    map.setPitch(85);
    map.setZoom(CameraParam.zoom);

    CameraParam.cameraPremierePersonne = 1;

    rotateCamera(0);
    correctionZoom();
    return (CameraParam);

  }

  function resetFirstPersonCamera(map){


    CameraParam.x0 = 0;
    CameraParam.y0 = 0;
    CameraParam.positionRotationX = 0;
    CameraParam.XmousePositionSaved = 0;
    CameraParam.FirstMouseMoveSkiped = 0;

    CameraParam.cameraPremierePersonne = 0;

    enableMapControls();

    map.setPitch(20);
    map.setZoom(17);

    return (CameraParam);

}


  function rotateCamera(pas) {

    if(CameraParam.cameraPremierePersonne == 1){

      CameraParam.positionRotationX += pas/(CameraParam.rotationSpeed*window.innerHeight);

      map.setCenter([
        CameraParam.x0+Math.sin(2*Math.PI*(CameraParam.positionRotationX/360))*CameraParam.positionRightingRadius*CorrectionLatitude(),
        CameraParam.y0+Math.cos(2*Math.PI*(CameraParam.positionRotationX/360))*CameraParam.positionRightingRadius
      ])
      map.rotateTo((CameraParam.positionRotationX) % 360, { duration: 0 });

    }
  }



  function camTP(coord){//coord=[lng,lat] ou coord={lng:val , lat:val}

    if(coord.lng==undefined){
      var coord={
        lng : coord[0],
        lat : coord[1]      
      }
    }
    
    if(CameraParam.cameraPremierePersonne == 1){
      
      CameraParam.x0=coord.lng;
      CameraParam.y0=coord.lat;

      var correctionX = CameraParam.positionRightingRadius*Math.sin(getBearingRadian())*CorrectionLatitude()
      var correctionY = CameraParam.positionRightingRadius*Math.cos(getBearingRadian())

      map.flyTo({
        center: [CameraParam.x0+correctionX,CameraParam.y0+correctionY],
        zoom: CameraParam.zoom,
        speed: 1,
        curve: 1,
      });

      
    }else{
      initializeFirstPersonCamera(map,coord);
    }
    
  }






  function addDIV(coord,color){
    var el = document.createElement('div');
    el.id = 'Div3d';
    el.style.background=color;
    el.style.width = 5 + 'px';
    el.style.height = 5 + 'px';
        
    // add marker to map
    new maplibregl.Marker(el)
    .setLngLat(coord)
    .addTo(map);
  }

var idpied=0;
  function addPied(coord){

    idpied++;
    map.removeLayer('idp'+(idpied-20));
    if(map.getSource('idp'+(idpied-20))!=undefined)map.removeSource('s'+(idpied-20));

    map.loadImage(
      "pied.png",
      (error, image) => {
        map.addImage("pied", image , {pixelRatio:3});
      }
    );

    map.addSource('s'+idpied, {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': coord
          }
         }
        ]
      }
    });

      map.addLayer({
        'id': 'idp'+idpied,
        'type': 'symbol',
        'source': 's'+idpied,
        'layout': {
          'icon-image': "pied",
          'icon-size': 2
        }
      });

  }


  function disableMapControls(){
    map.dragPan.disable();
    map.keyboard.disable();
    map.touchZoomRotate.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.scrollZoom.disable();
  }

  function enableMapControls(){
    map.dragPan.enable();
    map.keyboard.enable();
    map.touchZoomRotate.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
    map.scrollZoom.enable();
  }
    
  window.addEventListener('mousemove', function(e){  
    
    if(CameraParam.cameraPremierePersonne == 1){

      if(e.buttons == 1){// 1 => click gauche

        var XpositionMouseDifference = CameraParam.XmousePositionSaved-e.x;

        if(CameraParam.FirstMouseMoveSkiped==1){

          rotateCamera(XpositionMouseDifference)

        }else{

          CameraParam.FirstMouseMoveSkiped=1;

        }

        CameraParam.XmousePositionSaved=e.x;
      
      }else{

        CameraParam.FirstMouseMoveSkiped=0;
      }

      if(e.buttons >= 2)rotateCamera(0) // 2=>click droit
     
    }

  });


  window.addEventListener('touchmove', function(e){  
 
    var XpositionMouseDifference = CameraParam.XmousePositionSaved-e.touches[0].clientX;

    if(CameraParam.FirstMouseMoveSkiped==1){

      rotateCamera(XpositionMouseDifference)

    }else{

      CameraParam.FirstMouseMoveSkiped=1;

    }

    CameraParam.XmousePositionSaved=e.touches[0].clientX;

  });


  window.addEventListener('touchend', function(e){  
    CameraParam.FirstMouseMoveSkiped=0;
  });


  document.addEventListener('keydown', function (e){

    if(CameraParam.cameraPremierePersonne == 1){

        var incrementX = CameraParam.stepSize*Math.sin(getBearingRadian())*CorrectionLatitude();
        var incrementY = CameraParam.stepSize*Math.cos(getBearingRadian()); 

        if (e.keyCode == CameraParam.keyUp[0] || e.keyCode == CameraParam.keyUp[1] || e.keyCode == CameraParam.keyUp[2]){

          CameraParam.x0+=incrementX;
          CameraParam.y0+=incrementY;

        } else if (e.keyCode == CameraParam.keyDown[0] || e.keyCode == CameraParam.keyDown[1] || e.keyCode == CameraParam.keyDown[2]){

          CameraParam.x0-=incrementX;
          CameraParam.y0-=incrementY;

        } else if (e.keyCode == CameraParam.keyRight[0] || e.keyCode == CameraParam.keyRight[1] || e.keyCode == CameraParam.keyRight[2]){

          CameraParam.x0+=incrementX;
          CameraParam.y0-=incrementY;       

        } else if (e.keyCode == CameraParam.keyLeft[0] || e.keyCode == CameraParam.keyLeft[1] || e.keyCode == CameraParam.keyLeft[2]){

          CameraParam.x0-=incrementX;
          CameraParam.y0+=incrementY;         

      }else if(e.keyCode == CameraParam.keyToChangeViewMode){
        resetFirstPersonCamera(map);
      }else if(e.keyCode == 102){
        rotateCamera(50);
      }else if(e.keyCode == 100){
        rotateCamera(-50);
      }

      rotateCamera(0);

    }else if(e.keyCode == CameraParam.keyToChangeViewMode){
      initializeFirstPersonCamera(map,map.getCenter());
    }

  });

  window.addEventListener('resize', correctionZoom);


