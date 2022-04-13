
function addTextures(){
    map.addLayer({
        'id': "textureIMG",
        'type': 'fill-extrusion',
        'source': 'floorplanTexture',
        'paint': {
          
          "fill-extrusion-pattern": ['get', 'IMGtexture'],

          'fill-extrusion-height': ['get', 'height'],

          'fill-extrusion-base': ['get', 'base_height'],

          'fill-extrusion-opacity': 1

        },
    });
}




function removeTextures(){
    if(map.getLayer("textureIMG")!=null){
        map.removeLayer("textureIMG");
    };
}

