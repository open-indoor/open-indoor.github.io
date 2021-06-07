var psList = [];
var scene, camera, psMain;

AFRAME.registerComponent('cross', {

  schema: {
    index: {type: 'number', default: '-1'}
  },

  init: function() {

      var data = this.data;
      var el = this.el;

      el.addEventListener("click", function(event) {
        psMain.setAttribute("src", psList[data.index].src);
        addCrossOnPhotosphere(psList[data.index]);
      });

      el.setAttribute("src", "assets/512512.png");
  },

  tick: function () {
    var el = this.el;
    var rotationTmp = this.rotationTmp = this.rotationTmp || {x: 0, y: 0, z: 0};
    var rotation = el.getAttribute('rotation');
    rotationTmp.x = rotation.x + 0.5;
    rotationTmp.y = rotation.y + 0.5;
    rotationTmp.z = rotation.z + 0.5;
    el.setAttribute('rotation', rotationTmp);
  }

});

function addCrossOnPhotosphere(origin) {
  //Move photosphere
  psMain.setAttribute("position", origin.x + " 0 " + origin.z);
  camera.setAttribute("position", origin.x + " 0 " + origin.z);

  //Remove ancient cross
  var listCross = document.querySelectorAll("a-box");
  listCross.forEach(currentValue => {
    currentValue.parentNode.removeChild(currentValue);
  });

  //Add new cross
  origin.neighbourList.forEach(currentValue => {
    var index = psList.indexOf(currentValue);
    var d = Math.sqrt(Math.pow((currentValue.x - origin.x), 2) + Math.pow((currentValue.z - origin.z), 2));
    var x = Math.round(origin.x + (50/d)*(currentValue.x - origin.x));
    var z = Math.round(origin.z + (50/d)*(currentValue.z - origin.z));

    var cross = document.createElement("a-box");
    cross.setAttribute("id", "cross__" + index)
    cross.setAttribute("position", x + " 0 " + z);
    cross.setAttribute("scale", "3 3 3");
    cross.setAttribute("rotation", "45 45 0");
    cross.setAttribute("cross", "index: "+ index);
    scene.appendChild(cross);
  });
};

function run() {
  camera = document.querySelector("a-camera");
  psMain = document.getElementById("main-ps");
  psMain.setAttribute("src", psList[0].src);
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
    if(curr.xdata == x && curr.zdata == z)
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

$.getJSON("ArtGallery.geojson", function(result){
  var xref, zref, x, z;
  var factor = 2000000;
  var data = result.features;
  data.forEach(currentValue => {
    if(currentValue.geometry.type == "Point" && currentValue.properties.image != undefined)
    {
      //Traitement des coordonnées (Decimal degrees -> Useful coordinates)
      if(psList.length == 0)
      {
        xref = currentValue.geometry.coordinates[0];
        zref = currentValue.geometry.coordinates[1];
      }

      x = -Math.round((currentValue.geometry.coordinates[0] - xref) * factor);
      z = Math.round((currentValue.geometry.coordinates[1] - zref) * factor);

      psList.push(new Photosphere(currentValue.geometry.coordinates[0], currentValue.geometry.coordinates[1], x, z, currentValue.properties.image));
    }
    else if(currentValue.geometry.type == "LineString" && currentValue.properties.highway == "footway")
    {
      //Traitement des chemins entre les points
      var length = currentValue.geometry.coordinates.length;
      var a, b, curr, prec;
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