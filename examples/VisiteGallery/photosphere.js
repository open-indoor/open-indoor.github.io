class Photosphere {

    constructor(xdata, zdata, x, z, src){
        this.xdata = xdata;
        this.zdata = zdata;
        this.x = x;
        this.z = z;
        this.src = src;
        this.neighbourList = [];
    }

    addNeighbour(ps){
        this.neighbourList.push(ps);
    }

}