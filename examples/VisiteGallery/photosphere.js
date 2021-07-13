class Photosphere {

    constructor(lat, lon, src, POI){
        this.lat = lat;
        this.lon = lon;
        this.src = src;
        this.POI = POI;
        this.neighbourList = [];
    }

    addNeighbour(ps){
        this.neighbourList.push(ps);
    }

}