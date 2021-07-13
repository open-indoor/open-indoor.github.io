var psList = [];
var poiList = [];
var scene, psMain, camera, imgLink, POI_button;

AFRAME.registerComponent('displacement', {

  schema: {
    index: {type: 'number', default: -1}
  },

  init: function() {

      var data = this.data;
      var el = this.el;

      el.addEventListener("click", function(event) {
        psMain.setAttribute("src", psList[data.index].src);
        addCrossOnPhotosphere(psList[data.index]);
      });
  },

});

function addCrossOnPhotosphere(origin) {

  //Remove ancient cross
  var listCross = document.querySelectorAll(".rot");
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
  if(imgLink == null)
  {
    POI_button.setAttribute("visible", "false")
  } else {
    POI_button.setAttribute("visible", "true")
  }

  //Add new cross
  origin.neighbourList.forEach(currentValue => {
    var index = psList.indexOf(currentValue);

    var point1 = turf.point([origin.lat, origin.lon]);
    var point2 = turf.point([currentValue.lat, currentValue.lon]);

    var distance = turf.distance(point1, point2) * 1000; //distance en mètre
    var bearing = turf.bearing(point1, point2);

    var rot_box = document.createElement("a-entity");
    rot_box.setAttribute("id", "rot_box__" + index)
    rot_box.setAttribute("class", "rot")
    rot_box.setAttribute("rotation", "0 " + (180 - bearing) + " 0");
    scene.appendChild(rot_box);

    var cross = document.createElement("a-obj-model");
    cross.setAttribute("id", "cross__" + index)
    rot_box.setAttribute("class", "cross")
    cross.setAttribute("position", distance + " -1.8 0");
    cross.setAttribute("rotation", "0 0 0");
    cross.setAttribute("scale", "0.5 0.5 0.5");
    cross.setAttribute("displacement", "index: "+ index);
    cross.setAttribute("src", "#marker");
    rot_box.appendChild(cross);

    var arrow = document.createElement("a-obj-model");
    arrow.setAttribute("id", "arrow__" + index)
    rot_box.setAttribute("class", "arrow")
    arrow.setAttribute("position", 1.5 + " -1.8 0");
    arrow.setAttribute("rotation", "0 90 0");
    arrow.setAttribute("scale", "0.3 0.3 0.3");
    arrow.setAttribute("displacement", "index: "+ index);
    arrow.setAttribute("src", "#arrow");
    rot_box.appendChild(arrow);
  });
};

function run() {
  camera = document.getElementById("camera");
  psMain = document.getElementById("main-ps");
  psMain.setAttribute("src", psList[0].src);
  POI_button = document.querySelector('#refresh-button');
  document.querySelector('#refresh-button').addEventListener('click', function() {
    imgLink.forEach(element => {
      window.open(element, '_blank', 'location=yes,height=windows.height,width=windows.width,scrollbars=yes,status=yes');
    });
  });
  addCrossOnPhotosphere(psList[0])
};

var getValues = function(){
  scene = document.querySelector("a-scene");
  if (scene.hasLoaded) {
    run();
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