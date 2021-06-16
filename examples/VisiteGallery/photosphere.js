class Photosphere {

    constructor(lat, lon, src){
        this.lat = lat;
        this.lon = lon;
        this.src = src;
        this.neighbourList = [];
    }

    addNeighbour(ps){
        this.neighbourList.push(ps);
    }

}