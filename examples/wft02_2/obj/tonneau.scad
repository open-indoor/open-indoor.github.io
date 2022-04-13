a=30;


module un(){
cylinder(900,350,350,$fn=a);
translate([0,0,100])scale([1,1,0.2])sphere(360);
translate([0,0,100])cylinder(50,360,360,$fn=a);
translate([0,0,150])scale([1,1,0.2])sphere(360);

translate([0,0,400])scale([1,1,0.2])sphere(360);
translate([0,0,400])cylinder(50,360,360,$fn=a);
translate([0,0,450])scale([1,1,0.2])sphere(360);

translate([0,0,800])scale([1,1,0.2])sphere(360);
translate([0,0,800])cylinder(50,360,360,$fn=a);
translate([0,0,850])scale([1,1,0.2])sphere(360);
}

difference(){
    un();
    
    translate([0,0,10])cylinder(950,320,320,$fn=a);
}