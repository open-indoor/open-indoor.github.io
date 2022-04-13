

function start3Dprosess(geojsonPath){
    $.getJSON(geojsonPath, function(data) {

        var map = addNewMap([
            -0.89580493096,
                        47.05713867388
        ],18,60); // position,zoom,angle

        map.on('style.load', function () {

            addAll3dOBJfromGeojson(data);

        });

    });
}


function convertPosition(coord,OBJrotate){

    var modelAltitude = 0;
    var modelRotate = [Math.PI / 2+OBJrotate[0]*(Math.PI/180), OBJrotate[1]*(Math.PI/180), 0+OBJrotate[2]*(Math.PI/180)];
    
    var modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
        coord,
        modelAltitude
    );

    var modelTransform01 = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],

        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    var rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform01.rotateX
    );
    var rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform01.rotateY
    );
    var rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform01.rotateZ
    );


    var l = new THREE.Matrix4()
        .makeTranslation(
            modelTransform01.translateX,
            modelTransform01.translateY,
            modelTransform01.translateZ
        
        )
        .scale(
            new THREE.Vector3(
            modelTransform01.scale,
            -modelTransform01.scale,
            modelTransform01.scale
        )
    )
    .multiply(rotationX)
    .multiply(rotationY)
    .multiply(rotationZ);

    return l
}


function addNewLight(a,b,c){

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(a, b, c).normalize();

    return directionalLight
}


function addNew3DObject(OBJprop,scaleSup=1,rotationSup=[0,0,0]){
   
    var OBJid=OBJprop.OBJid;
    var OBJname=OBJprop.OBJgeojsonPath;
    var OBJmodel=OBJprop.OBJtable[OBJprop.OBJtableCoord[0]][OBJprop.OBJtableCoord[1]];
    var coord=OBJprop.OBJcoord;

    var RotationTotal = [rotationSup[0]+OBJmodel.rotate0[0],rotationSup[1]+OBJmodel.rotate0[1]+OBJprop.OBJangle,rotationSup[2]+OBJmodel.rotate0[2]];
    //console.log(OBJprop.OBJangle);
    var customLayer01 = {
        
        id: OBJid,
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, gl) {

            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();
            
            this.scene.add(addNewLight(200,200,200));
            this.scene.add(addNewLight(-200,-200,-200));

            var loader = new THREE.GLTFLoader();

            loader.load(
                OBJmodel.path,
                function (glb) {
                    const root = glb.scene;
                    root.scale.set(OBJmodel.scale*scaleSup,OBJmodel.scale*scaleSup,OBJmodel.scale*scaleSup);
                    this.scene.add(root);
                }.bind(this)
            );
                                            
            this.map = map;
            
            this.renderer = new THREE.WebGLRenderer({

                canvas: map.getCanvas(),                   
                context: gl,
                antialias: true
            });
            
            this.renderer.autoClear = false;
        },
        render: function (gl, matrix) {
    
            var m = new THREE.Matrix4().fromArray(matrix);
            
            this.camera.projectionMatrix = m.multiply(convertPosition(coord,RotationTotal));
            this.renderer.state.reset();
            this.renderer.render(this.scene, this.camera);
            this.map.triggerRepaint();
        }
    };
    //addClickableDIV(OBJid,coord);
    return map.addLayer(customLayer01);
}


function addNewMap(coord,zoom,angle){
    map = (window.map = new maplibregl.Map({
        container: 'map',
        style:
        'https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
        zoom: zoom,
        center: coord,
        pitch: angle,
        antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
    }));
    map

    return map;
}


function addClickableDIV(name,coord){
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.background="red";
    el.style.width = 80 + 'px';
    el.style.height = 80 + 'px';
        
    el.addEventListener('click', function () {

        window.alert(name);
    });
    
        
    // add marker to map
    new maplibregl.Marker(el)
    .setLngLat(coord)
    .addTo(map);
}



function foreachOBJinTable(OBJprop){
    if(OBJprop.OBJgeojsonPath != undefined){
        for(var i=0; i<OBJprop.OBJtable.length+1 ;i++){
            if(i==OBJprop.OBJtable.length){
                addNew3DObject(OBJprop);
            }else if(OBJprop.OBJgeojsonPath==OBJprop.OBJtable[i][0]){
                OBJprop.OBJtableCoord[0]=i;
                addNew3DObject(OBJprop);
                i=OBJprop.OBJtable.length+10;
            }
        }
    }
}





function addAll3dOBJfromGeojson(geojson){

    
    var idOBJ =1;
    geojson.features.forEach(function (marker) {
        
        idOBJ++;

        var OBJprop ={
            is3dOBJ:  0,
            OBJid: idOBJ,
            OBJcoord: marker.geometry.coordinates,
            OBJgeojsonPath: "default",
            OBJtable: defaultTable,
            OBJtableCoord: [0,1],
            OBJifNotExiste: OBJdefault,
            OBJangle: 0
        } 

        if(marker.properties.obj_angle_N != undefined){
            OBJprop.OBJangle = marker.properties.obj_angle_N
        }

       
        if(marker.properties.emergency!= undefined){                                    
            OBJprop.is3dOBJ = 1;

            OBJprop.OBJgeojsonPath = marker.properties.emergency;
            OBJprop.OBJtable = emergencyTable;

        }else if(marker.properties.amenity=="vending_machine"){
            OBJprop.is3dOBJ = 1;

            OBJprop.OBJgeojsonPath = marker.properties.vending;
            OBJprop.OBJtable = vendingTable;

        }else if(marker.properties.Obj_3D_Indoor!=undefined){
            OBJprop.is3dOBJ = 1;
            
            OBJprop.OBJgeojsonPath = marker.properties.Obj_3D_Indoor;
            OBJprop.OBJtable = amenityOBJTable;

        }



        if(OBJprop.is3dOBJ == 1){
            foreachOBJinTable(OBJprop);
        }      
    });
}





