AFRAME.registerComponent('photosphere-component', {

    schema: {
        src: {type: 'string'}
    },

    init: function () {
        var data = this.data;
        var el = this.el;
        
        el.setAttribute('src', data.src);
    },

});