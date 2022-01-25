
module un(){
    difference(){
        cube([400,310,40]);
        translate([60,60,2.5])cube([400-120,310-120,40]);
        translate([60+100,60+55,2.5])cube([80,310-120,40]);
        translate([60+100+60,240,2.5])cube([40,50,35]);
        translate([60+100-30,260,2.5])cube([40,30,35]);
        translate([60-30,225,2.5])cube([40,25,35]);
    }

    translate([60+30,60+30,0])cube([400-120-60,310-120-60,40]);
    
    translate([325,249.5,0])cube([13,13,29]);
    translate([339.5,228,0])cube([13,13,29]);
    translate([339.5,150,0])cube([13,13,29]);
    translate([339.5,175,0])cube([13,13,29]);
    translate([339.5,100,0])cube([13,13,29]);
    translate([339.5,70,0])cube([13,13,29]);
    
    translate([297.5,202,0])cube([13,13,29]);   
    translate([297.5,170,0])cube([13,13,29]);
    translate([297.5,145,0])cube([13,13,29]);
    
    translate([297.5,47.5,0])cube([13,13,29]);
    translate([265,47.5,0])cube([13,13,29]);
    translate([195,47.5,0])cube([13,13,29]);
    translate([130,47.5,0])cube([13,13,29]);
    translate([95,47.5,0])cube([13,13,29]);
    
    translate([17.5,228,0])cube([13,13,29]);
    translate([47.5,160,0])cube([13,13,29]);
    translate([47.5,190,0])cube([13,13,29]);
    translate([47.5,100,0])cube([13,13,29]);
    translate([47.5,70,0])cube([13,13,29]);
    
    translate([89.5,202,0])cube([13,13,29]);   
    //translate([89.5,170,0])cube([13,13,29]);
    translate([89.5,145,0])cube([13,13,29]);
    
    translate([259.5,275,0])cube([13,13,29]);
    
    translate([116,249.5,0])cube([13,13,29]);
    
    translate([117.5,261.5,0])cube([13,13,29]);
    translate([117.5,275,0])cube([13,13,29]);
    
    
    translate([90,200,36])cube([5,60,4]);
    
    
}



module deux(){
    translate([0,0,40])difference(){
        cube([400,310,40]);
        translate([60,60,2])cube([400-120,310-120,45]);
        translate([60+100,60+55+134,-2])cube([80,310-120-135,45]);
        
    }

    translate([60+30,60+30,40])cube([400-120-60,310-120-60,45]);
    

}

module trois(){
    difference(){

           un();

       translate([200-35,155-50-16,-5])cube([70,132,120]); 
    }
    
}

module quatre(){
    difference(){
           deux();
       translate([200-35,155-50,-5])cube([70,116,120]); 
    }
}

module cinq(){
    translate([200-35,155-50-16+4,-5])cube([70,1,44]);
    translate([200-35,155+50,-5])cube([70,1,90]);
}


trois();
//quatre();
//cinq();
//translate([0,0,80])cube([400,310,2]);