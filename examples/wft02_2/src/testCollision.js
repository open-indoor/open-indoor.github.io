function testCollision(x,y){


  var data = getData();
  var coord = [x,y];

  let mur = {
    type: "FeatureCollection",
    features: data.features.filter(feat_ => ('height' in feat_.properties))
  }

  let cible = {
    type: "FeatureCollection",
    features: data.features.filter(feat_ => ('cible' in feat_.properties))
  }

  let porte = {
    type: "FeatureCollection",
    features: data.features.filter(feat_ => ('porte' in feat_.properties))
  }

  let obj = {
    type: "FeatureCollection",
    features: data.features.filter(feat_ => ('obj' in feat_.properties))
  }





  var insidePolygon = false;





  mur.features.forEach(function (marker) {
    if(marker.properties.height > 0.4){
      if(isOnPolygon(coord, marker.geometry.coordinates)){
        insidePolygon = true;
      }
    }
  });




  cible.features.forEach(function (marker) {

    if(marker.geometry.coordinates[0].length>1){

      for(var i=0;i<marker.geometry.coordinates.length;i++){
        if(map.getLayer("c"+marker.properties.cible+i)!=undefined){

          var hitBox=getHitBox(marker.geometry.coordinates[i],0.000007);
    
          if(isOnPolygon(coord, hitBox.geometry.coordinates)){
            
            insidePolygon = true;
          }
        }  

      }

    }else{
      if(map.getLayer("c"+marker.properties.cible)!=undefined){


        var hitBox=getHitBox(marker.geometry.coordinates,0.000007);
  
        if(isOnPolygon(coord, hitBox.geometry.coordinates)){
          insidePolygon = true;
        }
      }  
    }

    
  });





  porte.features.forEach(function (marker) {


    if(marker.geometry.coordinates[0].length>1){

      for(var i=0;i<marker.geometry.coordinates.length;i++){
        if(map.getLayer("p"+marker.properties.porte+i)!=undefined){
          var t= map.getLayer(marker.properties.porte+i);
      
      if(t.implementation.scene.position.x<0){
      }else{

          var hitBox=getHitBox(marker.geometry.coordinates[i],0.00004);
    
          if(isOnPolygon(coord, hitBox.geometry.coordinates)){

            var t= map.getLayer(marker.properties.porte);
            if(t!=undefined){

                openDoor(t);
                
            }
            
            insidePolygon = true;
          }
        }
        }  

      }

    }else{
      if(map.getLayer("p"+marker.properties.porte)!=undefined){

        var t= map.getLayer(marker.properties.porte);
      
        if(t.implementation.scene.position.x<0){
        }else{
        var hitBox=getHitBox(marker.geometry.coordinates,0.00004);
  
        if(isOnPolygon(coord, hitBox.geometry.coordinates)){
          var t= map.getLayer(marker.properties.porte);
          if(t!=undefined){

              openDoor(t);
              
          }
          insidePolygon = true;
        }
      }
      }  
    }



   
  });



  obj.features.forEach(function (marker) {

    if(marker.geometry.coordinates[0].length>1){

      for(var i=0;i<marker.geometry.coordinates.length;i++){
        if(map.getLayer(marker.properties.obj+i)!=undefined){

          if(marker.properties.hitBox!=0){
          var hitBox=getHitBox(marker.geometry.coordinates[i],0.00001);
    
          if(isOnPolygon(coord, hitBox.geometry.coordinates)){
            pickUpOBJ(marker,i);
            insidePolygon = true;
          }
        }
        }  

      }

    }else{
      if(map.getLayer(marker.properties.obj)!=undefined){

        if(marker.properties.hitBox!=0){
        var hitBox=getHitBox(marker.geometry.coordinates,0.00001);
  
        if(isOnPolygon(coord, hitBox.geometry.coordinates)){
          pickUpOBJ(marker,null);
          insidePolygon = true;
        }
      }
      }  
    }


  });





  

  return insidePolygon;

}


function isOnPolygon(coord, polygon){
  
  var polygon = polygon[0];

  var d=0;
  var g=0;

  for(var i=0;i<polygon.length -1;i++){
    if( (polygon[i][0]<coord[0]) !== (polygon[i+1][0]<coord[0]) ){
      var t = (coord[0] - polygon[i][0]) * (polygon[i+1][1] -polygon[i][1]) - (coord[1] - polygon[i][1]) * (polygon[i+1][0] - polygon[i][0]);
    
      if(t < 0){//le point est a droite
        d++
      }else{//le point est a gauche (ou sur la ligne)
        g++
      }
    } 
  }

  return(d!=g);
}









