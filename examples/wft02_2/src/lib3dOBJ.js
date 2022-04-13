

var OBJdefault ={
    path: 'obj/cube.glb',
    scale: 10,
    rotate0: [0,0,0]
}

var OBJundefined ={
    path: 'obj/sphere.glb',
    scale: 10,
    rotate0: [0,0,0]
}








var OBJdefaultVending ={
    path: 'obj/vendingCube.glb',
    scale: 10,
    rotate0: [0,0,0]
}

var OBJdefaultEmergency ={
    path: 'obj/emergencyCube.glb',
    scale: 10,
    rotate0: [0,0,0]
}






var OBJextincteur ={
    path: 'obj/extincteur.glb',
    scale: 5,
    rotate0: [0,90,0]
} 

var OBJcoffeeMachine ={
    path: 'obj/coffeeMachine.glb',
    scale: 10,
    rotate0: [0,0,0]
} 

var OBJtable ={
    path: 'obj/table.glb',
    scale: 1,
    rotate0: [0,0,0]
} 






var player01 ={
    path: 'obj/player/wraith.gltf',
    scale: 1,
    rotate0: [0,0,0]
}
var player02 ={
    path: 'obj/player/player02.gltf',
    scale: 1,
    rotate0: [0,0,0]
}
var player03 ={
    path: 'obj/player/player03.gltf',
    scale: 1,
    rotate0: [0,0,0]
}
var player04 ={
    path: 'obj/player/player04.gltf',
    scale: 1,
    rotate0: [0,0,0]
}






var porte01 ={
    path: 'obj/porte0.glb',
    scale: 12,
    rotate0: [0,0,0]
}

var colt01 ={
    path: 'obj/colt01.glb',
    scale: 10,
    rotate0: [0,0,0]
}

var lampe01 ={
    path: 'obj/lampe01.glb',
    scale: 0.8,
    rotate0: [0,0,0]
}

var tonneau01 ={
    path: 'obj/tonneau.glb',
    scale: 1.5,
    rotate0: [0,0,0]
}



var munition01 ={
    path: 'obj/munition01.glb',
    scale: 3,
    rotate0: [0,0,0]
}
var gold01 ={
    path: 'obj/gold01.glb',
    scale: 2,
    rotate0: [0,0,0]
}







var toit ={
    path: 'obj/toit.glb',
    scale: 18,
    rotate0: [0,0,0]
}




var defaultTable = [["OBJdefault",OBJdefault]];

var vendingTable = [
    ["default",OBJdefaultVending],
    ["coffee",OBJcoffeeMachine],
    ["drinks",OBJdefaultVending],
    ["fuel",OBJdefaultVending],
    ["parking_tickets",OBJdefaultVending],
    ["water",OBJdefaultVending]
];

var emergencyTable = [
    ["default",OBJdefaultEmergency],
    ["fire_extinguisher",OBJextincteur],
    ["defibrillator",OBJdefaultEmergency],
    ["fire_alarm_box",OBJdefaultEmergency],
    ["fire_hydrant",OBJdefaultEmergency],
    ["first_aid_kit",OBJdefaultEmergency]
];

var amenityOBJTable = [
    ["default",OBJdefault],
    ["table1",OBJtable],

    ["player01",player01],
    ["player02",player02],
    ["player03",player03],
    ["player04",player04],

    ["porte01",porte01],
    
    ["colt01",colt01],

    ["lampe01",lampe01],
    ["tonneau01",tonneau01],

    ["munition01",munition01],
    ["gold01",gold01],



    ["toit",toit]
];

