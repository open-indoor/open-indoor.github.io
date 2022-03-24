import Fps from './module/fps.js';




var map = new maplibregl.Map({
    container: 'map',
    style: {
        "id": "raster",
        "version": 8,
        "name": "Raster tiles",
        "center": [0, 0],
        "zoom": 0,
        "sources": {
            "raster-tiles": {
                "type": "raster",
                "tiles": [
                    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                ],
                "tileSize": 256,
                "minzoom": 0,
                "maxzoom": 19
            },
            // "gallery": {
            //     'type': 'geojson',
            //     'data': 'https://vegeta.openindoor.io/indoor/art_gallery/art_gallery.geojson'
            // }
        },
        "sprite": "https://open-indoor.github.io/sprite_2/sprite",
        "glyphs": "https://open-indoor.github.io/fonts/{fontstack}/{range}.pbf",
        "layers": [{
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "#e0dfdf"
            }
        }, {
            "id": "simple-tiles",
            "type": "raster",
            "source": "raster-tiles"
        }]
    },
    center: [-74.0449681, 40.6898827],
    zoom: 20,
    pitch: 0,
    maxZoom: 24,
    maxPitch: 85,
});

let fps = new Fps(map);

map.on('click', 'gallery-step', (e) => {
    if (e.features != null && e.features.length > 0) {
        let feature = e.features[0];
        let coords = feature.geometry.coordinates;
        let newPos = {
            lng: coords[0],
            lat: coords[1],
            altitude: 1.7,
            pitch: 85
        };

        let bearing = feature.properties.direction != null ? parseInt(feature.properties.direction) : 0;

        fps.camera_go_to(newPos, bearing);
    }
});

map.on('load', function() {
    fetch("https://vegeta.openindoor.io/indoor/art_gallery/art_gallery.geojson").then(function(response) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/geo+json") !== -1) {
            return response.json().then(function(gallery) {
                map.addSource('gallery', {
                    'type': 'geojson',
                    'data': gallery
                });
                for (let feature of gallery.features.filter(
                        (feat_) => {
                            return (
                                feat_.properties != null &&
                                feat_.properties.image != null &&
                                feat_.properties.artwork_type != null &&
                                feat_.properties.artwork_type === "painting"
                            )
                        }
                    )) {
                    console.log('feature.properties:', feature.properties);
                }

                map.loadImage(
                    'https://vegeta.openindoor.io/indoor/art_gallery/marker.png',
                    function(error, image) {
                        if (error) throw error;
                        map.addImage('marker', image);

                    }
                );
                map.loadImage(
                    'https://vegeta.openindoor.io/indoor/art_gallery/parquet.png',
                    function(error, image) {
                        if (error) throw error;
                        map.addImage('parquet', image);
                    }
                );

                map.addLayer({
                    'id': 'gallery-ground',
                    'type': 'fill',
                    'source': 'gallery',
                    'paint': {
                        'fill-pattern': ["get", "pattern"],
                    },
                    'filter': [
                        "all", ['==', '$type', 'Polygon'],
                        ["has", "floor:material"]
                    ]
                })
                map.addLayer({
                    'id': 'gallery-step',
                    'type': 'symbol',
                    'source': 'gallery',
                    'filter': ['==', '$type', 'Point'],
                    'layout': {
                        'icon-image': 'marker',
                    },
                })
                map.addLayer({
                    'id': 'gallery-panel',
                    'type': 'fill-extrusion',
                    'source': 'gallery',
                    'filter': [
                        "all", [
                            'has', 'color'
                        ],
                        [
                            'has', 'indoor'
                        ],
                        [
                            '==', '$type', 'Polygon'
                        ],
                    ],
                    'paint': {
                        'fill-extrusion-color': ['get', 'color'],
                        'fill-extrusion-height': 2.5,
                        'fill-extrusion-opacity': 0.5
                    },
                });
                map.addLayer({
                    'id': 'gallery-paint',
                    'type': 'fill-extrusion',
                    'source': 'gallery',
                    'paint': {
                        'fill-extrusion-base': ["to-number", ["get", "elevation"]],
                        'fill-extrusion-height': [
                            "+", ["to-number", ["get", "elevation"]],
                            ["to-number", ["get", "height"]]
                        ],
                        'fill-extrusion-color': "#000"
                    },
                    'filter': [
                        "all", ['has', 'image'],
                        ['has', 'artwork_type']
                    ],
                })

            });
        } else {
            console.log("Oops, nous n'avons pas du JSON!");
        }
    });
});