//PART 1 
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//------------------------------------------------------------------------------------------------------------
function createMap(earthquakeMarkers) {

        // Create the tile layer
        let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        //map object with options
        let myMap = L.map("map", { 
            center: [0, 0],
            zoom: 2,
        });

        streetmap.addTo(myMap);
        earthquakeMarkers.addTo(myMap);
}
//------------------------------------------------------------------------------------------------------------
function createMarkers(response) {
    let features = response.features;
    console.log(features);

    // Create a layer group to hold the earthquake markers
    let earthquakeMarkers = [];
    
    // Loop through the features array
    for (let i = 0; i < features.length; i++) {
        let earthquake = features[i];
        let { coordinates } = earthquake.geometry;
        let [longitude, latitude] = coordinates;
        
        let mag = earthquake.properties.mag; // Get the magnitude from properties
        
        // Customize marker size and color based on magnitude
        let radius = mag * 5;  // Adjust the multiplier to set the radius based on magnitude
        let color = getColor(mag);  // Use your getColor function to determine the color
        
        let earthquakeMarker = L.circleMarker([latitude, longitude], {
            radius: radius,
            color: color,
            fillColor: color,
            fillOpacity: 0.7
        }).bindPopup(`<strong>Magnitude: ${mag}<br>Place: ${earthquake.properties.place}</strong>`);
        
        earthquakeMarkers.push(earthquakeMarker);
    }

    // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
}

//------------------------------------------------------------------------------------------------------------
function onEachFeature(feature, layer) {
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