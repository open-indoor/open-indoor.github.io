a=15;

module un(){
    cylinder(40,50,20,$fn=a);
    translate([0,0,40])cylinder(40,20,20,$fn=a);
}

module deux(){

    difference(){
        un();
        translate([0,0,-1])cylinder(30,45,10,$fn=a); 
    }

    translate([])hull(){

    translate([0,0,10])sphere(10,$fn=a);
        translate([0,0,40])cylinder(40,10,15,$fn=a);
    }

}

translate([0,0,2500])scale([10,10,10])deux();