//PART 1 
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//------------------------------------------------------------------------------------------------------------
function createMap(earthquakeMarkers) {

        // Create the tile layer
        let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });//.addTo(myMap);

        // //baseMaps object to hold the streetmap layer
        // let baseMaps = {
        //     "Street Map": streetmap
        // };

        // //overlayMaps object to hold the earthquakeMarkers layer
        // let overlayMaps = {
        //     "Earthquakes" : earthquakeMarkers
        // };

        //map object with options
        let myMap = L.map("map", {   //"map-id" ???????
            center: [0, 0],
            zoom: 2,
            // layers : [streetmap, earthquakeMarkers]
        });
        streetmap.addTo(myMap);
        earthquakeMarkers.addTo(myMap);
        //Create a layer control, and pass it throguh baseMaps/overlayMaps. Add the layer control to the map
        // L.control.layers(baseMaps, overlayMaps, {
        //     collapsed: false
        // }).addTo(myMap);
}
//------------------------------------------------------------------------------------------------------------
function createMarkers(response) {
    //Pull the "features" property from response
    let features = response.features;
    // console.log(features);
    
    //Initialize an array to hold the earthquake markers
    let earthquakeMarkers = [];
    let earthquakeMarker = [];

    //Loop throough the features array
    // for (let i=0; i < features.length; i++) {
    //     let earthquake = features[i];
    //     let { coordinates, mag } = earthquake.geometry;
    //     let [longitude, latitude, depth] = coordinates;
     
    // }

    //Create a layer group that's made from the earthquake markers array, and pass it to the createMap function
    createMap(
        // L.layerGroup(
            L.geoJson(response, {
            onEachFeature: onEachFeature, 
            style: {radius: 10,
                    // color: getColor(features.properties.mag),
                    // fillColor: getColor(features.properties.mag),
                    fillOpacity: 0.7},
            
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            }}));

};
//------------------------------------------------------------------------------------------------------------
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    layer.bindPopup(`<strong>Magnitude: ${feature.properties.mag}<br> Place: ${feature.properties.place}</strong>` );
};

//------------------------------------------------------------------------------------------------------------
//Perform and API call to get the earthquake data. Call createMarkers when it completes
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);


//Function to deetermine marker color based on depth
function getColor(depth) {
    const colors = ['lightgreen', 'yellow', 'orange', 'red'];
    if (depth < 10) return colors[0];
    if (depth < 30) return colors[1];
    if (depth < 70) return colors[2];
    return colors[3];
};

//------------------------------------------------------------------------------------------------------------
//PART 2 Gather and Plot More Data (Optional)