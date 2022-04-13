function addCible(data){


  let Cible = {
      type: "FeatureCollection",
      features: data.features.filter(feat_ => ('cible' in feat_.properties))
  }

  let Porte = {
    type: "FeatureCollection",
    features: data.features.filter(feat_ => ('porte' in feat_.properties))
  }

  let obj = {
    type: "FeatureCollection",
    features: data.features.filter(feat_ => ('obj' in feat_.properties))
  }

    
      
  Cible.features.forEach(function (marker) {
  
      add3DOBJ(marker.properties.cible,"c",marker,0.000007);
      
      addForEachClickDetect(marker)

         
  });



  Porte.features.forEach(function (marker) {
      
    add3DOBJ(marker.properties.porte,"p",marker,0.000009);
    
    map.on('mousedown', "p"+marker.properties.porte, (e) => {

        if(e.originalEvent.button==2){
              
            var t= map.getLayer(marker.properties.porte);
            if(t!=undefined){

                openDoor(t);
                
            }
        }                     
    });
        
  });



  obj.features.forEach(function (marker) {

    add3DOBJ(marker.properties.obj,"obj",marker,0);         

  });




}


function addForEachClickDetect(marker){

var i = 0;

if(marker.geometry.coordinates[0].length>1){

  marker.geometry.coordinates.forEach(function (coord) {

    var r={
      "type": "Feature",
      "properties": {
          "cible": marker.properties.cible + i,
          "Obj_3D_Indoor": marker.properties.Obj_3D_Indoor,
          "obj_angle_N": marker.properties.obj_angle_N,
          "level": marker.properties.level,
          "score" : marker.properties.score
      },
      "geometry": {
          "type": "Point",
          "coordinates": coord
      }
    }


    map.on('click', "c"+r.properties.cible, (e) => {

      killCible(r);

    });
    i++;

  });
}else{

  map.on('click', "c"+marker.properties.cible, (e) => {

    killCible(marker);

  });

}

}



function add3DOBJ(name,id,marker,hitBoxScall){
if(marker.geometry.coordinates[0].length>1){

  

  for(var i=0;i<marker.geometry.coordinates.length;i++){

    var OBJprop = getOBJparam(marker,name+i,marker.geometry.coordinates[i]);
    if(marker.properties.hitBox != 0 && hitBoxScall!=0){
      var hitBox=getHitBox(marker.geometry.coordinates[i],hitBoxScall);
      addLayerAndSource(name+i,hitBox,id);
    }
    if(marker.properties.life!=undefined)GameParam.cibleLife.push([name+i,marker.properties.life])
    
    foreachOBJinTable(OBJprop); 
    

  }

}else{
  var OBJprop = getOBJparam(marker,name);
  if(marker.properties.hitBox != 0 && hitBoxScall!=0){
    var hitBox=getHitBox(marker.geometry.coordinates,hitBoxScall);
    addLayerAndSource(name,hitBox,id);
  }
  foreachOBJinTable(OBJprop); 
}

}




function getOBJparam(marker,id,multiOBJCoord=null){

  var OBJprop ={
    is3dOBJ:  1,
    OBJid: id,
    OBJcoord: marker.geometry.coordinates,
    OBJgeojsonPath: marker.properties.Obj_3D_Indoor,
    OBJtable: amenityOBJTable,
    OBJtableCoord: [0,1],
    OBJifNotExiste: OBJdefault,
    OBJangle :0
  } 

  if(multiOBJCoord!=null)OBJprop.OBJcoord=multiOBJCoord;

  if(marker.properties.obj_angle_N != undefined){
    OBJprop.OBJangle = marker.properties.obj_angle_N
  }

  return OBJprop;
}



function getHitBox(coord,r){

var hitBox={
  "type": "Feature",
  "properties": {

      "level": "0",

  },
  "geometry": {
      "type": "Polygon",
      "coordinates": [[
          [
            coord[0],
            coord[1]+r
          ],
          [
            coord[0]+r,
            coord[1]
          ],
          [
            coord[0],
            coord[1]-r
          ],
          [
            coord[0]-r,
            coord[1]
          ],
          [
            coord[0],
            coord[1]+r
          ]
      ]]
  }
}

return hitBox;
}



function addLayerAndSource(name,hitBox,id){

map.addSource("s"+name, {
    
  'type': 'geojson',
  'data': hitBox
  });

  //console.log(marker)

if(map.getLayer(id+name)==undefined){

map.addLayer({
    'id': id+name,
    'type': 'fill-extrusion',
    'source': "s"+name,
    'paint': {

      'fill-extrusion-color':'red',
      
      'fill-extrusion-height': 3,
      
      'fill-extrusion-base': 0,
      
      'fill-extrusion-opacity': 0
    }    

  });  


}

}