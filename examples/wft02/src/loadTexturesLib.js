function loadTexture(){

        map.loadImage(
          "./textures/diamond.png",
          (error, image) => {
            map.addImage("IMGdiamond", image , {pixelRatio:2});
          }
        );

        map.loadImage(
          "textures/murBleu.png",
          (error, image) => {
            map.addImage("IMGmurBleu", image , {pixelRatio:2});
          }
        );

        map.loadImage(
          "textures/murMarron.png",
          (error, image) => {
            map.addImage("IMGmurMarron", image , {pixelRatio:2});
          }
        );

        map.loadImage(
          "textures/murRouge.png",
          (error, image) => {
            map.addImage("IMGmurRouge", image , {pixelRatio:2});
          }
        );

        map.loadImage(
          "textures/murGris.png",
          (error, image) => {
            map.addImage("IMGmurGris", image , {pixelRatio:2});
          }
        );  
        
        map.loadImage(
          "textures/sol01.png",
          (error, image) => {
            map.addImage("IMGsol01", image , {pixelRatio:1});
          }
        ); 

        
}