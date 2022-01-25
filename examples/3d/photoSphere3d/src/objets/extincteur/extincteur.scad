a=50;

module un(){
hull(){

scale([1,1,0.2])sphere(50,$fn=a);
 translate([0,0,250])scale([1,1,0.8])sphere(50,$fn=a);   
}

}

module deux(){
hull(){

translate([0,20,290])sphere(10,$fn=a); 
 translate([0,0,290])sphere(10,$fn=a);   
}

hull(){

translate([0,20,290])sphere(10,$fn=a); 
 translate([0,35,280])sphere(10,$fn=a);   
}

hull(){

translate([0,50,260])sphere(10,$fn=a); 
 translate([0,35,280])sphere(10,$fn=a);   
}

hull(){

translate([0,50,260])sphere(10,$fn=a); 
 translate([0,60,200])sphere(10,$fn=a);   
}

hull(){

translate([0,70,140])sphere(10,$fn=a); 
 translate([0,60,200])sphere(10,$fn=a);   
}

hull(){

translate([0,70,140])sphere(10,$fn=a); 
 translate([0,75,90])scale([1,1,0.2])sphere(20,$fn=a);   
}}
module trois(){
hull(){

translate([0,20,290])sphere(10,$fn=a); 
 translate([0,-40,290])scale([1,1,0.2])sphere(10,$fn=a);   
}


hull(){

translate([0,20,300])sphere(10,$fn=a); 
 translate([0,-40,320])scale([1,1,0.2])sphere(10,$fn=a);   
}

hull(){

translate([0,20,280])sphere(10,$fn=a); 
translate([0,20,300])sphere(10,$fn=a);   
}
}


un();
deux();
trois();






