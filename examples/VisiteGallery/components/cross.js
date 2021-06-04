AFRAME.registerComponent('cross', {

    

    init: function() {

        var data = this.data;
        var el = this.el;

        el.addEventListener("click", function(event) {
            console.log("Coucou");
        });

    }

});