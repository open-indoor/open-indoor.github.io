var psList = [];
var poiList = [];
var scene, psMain, camera, imgLink, POI_button_1, POI_button_2, POI_button_3;

AFRAME.registerComponent('displacement', {

  schema: {
    index: {type: 'number', default: -1}
  },

  init: function() {

      var data = this.data;
      var el = this.el;

      var position = new THREE.Vector3();
      this.el.object3D.getWorldPosition(position);

      el.addEventListener("click", function(event) {
        psMain.setAttribute("src", psList[data.index].src);
        //moveCamera(position.x,position.z);
        psMain.addEventListener('materialtextureloaded', function() {
          addElementOfNavigation(psList[data.index]);
        });
      });
  },

});

function addElementOfNavigation(origin) {

  //Remove ancient cross
  var listCross = document.querySelectorAll(".entity");
  listCross.forEach(currentValue => {
    currentValue.parentNode.removeChild(currentValue);
  });
  var listCross = document.querySelectorAll(".cross");
  listCross.forEach(currentValue => {
    currentValue.parentNode.removeChild(currentValue);
  });
  var listCross = document.querySelectorAll(".arrow");
  listCross.forEach(currentValue => {
    currentValue.parentNode.removeChild(currentValue);
  });

  //Bouton pour POI
  imgLink = origin.POI;
  if(imgLink != null)
  {
    switch(imgLink.length) {
      case 1:
        POI_button_1.setAttribute("visible", "true");
        POI_button_1.setAttribute("material", "src: " + imgLink[0]);
        POI_button_2.setAttribute("visible", "false");
        POI_button_3.setAttribute("visible", "false");
        break;
      case 2:
        POI_button_1.setAttribute("visible", "true");
        POI_button_1.setAttribute("material", "src: " + imgLink[0]);
        POI_button_2.setAttribute("visible", "true");
        POI_button_2.setAttribute("material", "src: " + imgLink[1]);
        POI_button_3.setAttribute("visible", "false");
        break;
      case 3:
        POI_button_1.setAttribute("visible", "true");
        POI_button_1.setAttribute("material", "src: " + imgLink[0]);
        POI_button_2.setAttribute("visible", "true");
        POI_button_2.setAttribute("material", "src: " + imgLink[1]);
        POI_button_3.setAttribute("visible", "true");
        POI_button_3.setAttribute("material", "src: " + imgLink[2]);
        break;
    } 
  } else {
      POI_button_1.setAttribute("visible", "false");
      POI_button_2.setAttribute("visible", "false");
      POI_button_3.setAttribute("visible", "false");
  }

  //Add new cross and arrow
  origin.neighbourList.forEach(currentValue => {
    var index = psList.indexOf(currentValue);

    var point1 = turf.point([origin.lat, origin.lon]);
    var point2 = turf.point([currentValue.lat, currentValue.lon]);

    var distance = turf.distance(point1, point2) * 1000; //distance en mètre
    var bearing = turf.bearing(point1, point2);

    var rot_box = document.createElement("a-entity");
    rot_box.setAttribute("id", "rot_box__" + index)
    rot_box.setAttribute("class", "entity")
    rot_box.setAttribute("rotation", "0 " + (180 - bearing) + " 0");
    scene.appendChild(rot_box);

    var cross = document.createElement("a-obj-model");
    cross.setAttribute("id", "cross__" + index)
    cross.setAttribute("class", "cross")
    cross.setAttribute("position",  distance + " -1.8 0");
    cross.setAttribute("rotation", "0 45 0");
    cross.setAttribute("scale", "0.5 0.5 0.5");
    cross.setAttribute("event-set__mouseenter", "scale: 0.8 0.8 0.8");
    cross.setAttribute("event-set__mouseleave", "scale: 0.5 0.5 0.5");
    cross.setAttribute("displacement", "index: "+ index);
    cross.setAttribute("src", "#marker");
    rot_box.appendChild(cross);

    var arrow = document.createElement("a-obj-model");
    arrow.setAttribute("id", "arrow__" + index)
    arrow.setAttribute("class", "arrow")
    arrow.setAttribute("position", 1.5 + " -1.8 0");
    arrow.setAttribute("rotation", "0 90 0");
    arrow.setAttribute("scale", "0.3 0.3 0.3");
    arrow.setAttribute("displacement", "index: "+ index);
    arrow.setAttribute("src", "#arrow");
    rot_box.appendChild(arrow);
  });
};

function run(onTrue) {
  camera = document.getElementById("camera");
  psMain = document.getElementById("main-ps");
  psMain.setAttribute("src", psList[0].src);
  POI_button_1 = document.querySelector('#refresh-button-1');
  POI_button_2 = document.querySelector('#refresh-button-2');
  POI_button_3 = document.querySelector('#refresh-button-3');
  document.querySelector('#refresh-button-1').addEventListener('click', function onClick() {
    window.open(imgLink[0], '_blank', 'location=yes,height=windows.height,width=windows.width,scrollbars=yes,status=yes');
  });
  document.querySelector('#refresh-button-2').addEventListener('click', function onClick() {
    window.open(imgLink[1], '_blank', 'location=yes,height=windows.height,width=windows.width,scrollbars=yes,status=yes');
  });
  document.querySelector('#refresh-button-3').addEventListener('click', function onClick() {
    window.open(imgLink[2], '_blank', 'location=yes,height=windows.height,width=windows.width,scrollbars=yes,status=yes');
  });
  addElementOfNavigation(psList[0])
};

var getValues = function(){
  scene = document.querySelector("a-scene");
  if (scene.hasLoaded) {
    run(true);
  } else {
    scene.addEventListener("loaded", run);
  }
}

function searchMatch(x, z){
  var i = 0, length = psList.length, isFound = false, curr;
  while(i < length && !isFound)
  {
    curr = psList[i];
    if(curr.lat == x && curr.lon == z)
    {
      isFound = true;
    }
    i = i + 1;
  }

  if(!isFound)
  {
    curr = null;
  }

  return curr;
}

//https://vegeta.openindoor.io/indoor/data/ArtGallery_V3.geojson
//ArtGalleryBlender.geojson

$.getJSON("https://vegeta.openindoor.io/indoor/data/ArtGallery_V3.geojson", function(result){
  var a, b, curr, prec, length;
  var data = result.features;
  data.forEach(currentValue => {
    if(currentValue.geometry.type == "Point" && currentValue.properties.image != undefined)
    {
      var POIdata = null;
      if(currentValue.properties.POI != undefined)
      {
        POIdata = currentValue.properties.POI;
      }
      psList.push(new Photosphere(currentValue.geometry.coordinates[0], currentValue.geometry.coordinates[1], currentValue.properties.image, POIdata));
    }
    else if(currentValue.geometry.type == "LineString" && currentValue.properties.highway == "footway")
    {
      //Traitement des chemins entre les points
      length = currentValue.geometry.coordinates.length;
      for(var i = 1; i < length; i++)
      {
        prec = currentValue.geometry.coordinates[i-1];
        curr = currentValue.geometry.coordinates[i];
        a = searchMatch(prec[0], prec[1]);
        b = searchMatch(curr[0], curr[1]);
        if(a != null && b!= null)
        {
          a.addNeighbour(b);
          b.addNeighbour(a);
        }
      }
    }
  });

  getValues();
});

/*
var start, x_start, y_start, x_rotation, y_rotation;
var duration = 1000;

function moveCamera(x_destination, y_destination) {
    start = null;
    x_start = camera.components["look-controls"].pitchObject.rotation.x;
    x_rotation = x_destination - x_start;
    y_start = camera.components["look-controls"].yawObject.rotation.y;
    y_rotation = y_destination - y_start;
    requestAnimationFrame(step);
}

function step(timestamp) {
    if (start === null) start = timestamp;
    var progress = timestamp - start;
    camera.components["look-controls"].pitchObject.rotation.x = x_start + x_rotation * progress / duration;
    camera.components["look-controls"].yawObject.rotation.y = y_start + y_rotation * progress / duration;
    if (progress < duration) {
        requestAnimationFrame(step);
    }
}
*/