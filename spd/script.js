// Global Variables
var timer = null;
var score = 0;
var differencesFound = 0; // You'll need to define the total number of differences
var totalDifferences = 2; // Example value
var map1, map2; // Declare maps globally to access them in functions

// Assuming you have the coordinates of the differences
var differences = [
    { id: 1, coords: [1202, 1252] },
    { id: 2, coords: [508, 1489] },
    // ... other differences
];

// Utility Functions
function formatTime(ms) {
    var seconds = Math.floor((ms / 1000) % 60);
    var minutes = Math.floor((ms / (1000 * 60)) % 60);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// Game-Specific Functions
function startTimer() {
    var startTime = new Date();
    timer = setInterval(function() {
        var elapsedTime = new Date() - startTime;
        document.getElementById('time').textContent = formatTime(elapsedTime);
    }, 1000);
}

function updateScore(points) {
    score += points;
    document.getElementById('score-value').textContent = score;
}

function differenceFound(marker) {
    differencesFound++;
    updateScore(10); // Increment the score
    marker.setIcon(L.divIcon({ className: 'difference-found' })); // Change marker icon

    // Play sound (if you've added sound)
    var audio = new Audio('path_to_success_sound.mp3');
    audio.play();

    if(differencesFound === totalDifferences) {
        endGame();
    }
}

function endGame() {
    clearInterval(timer);
    alert("Congratulations! You've found all differences!");
}

function resetGame() {
    clearInterval(timer);
    document.getElementById('time').textContent = "00:00";
    score = 0;
    differencesFound = 0;
    updateScore(0);
    // Reset the maps and clear differences
}

// Leaflet Map Related Functions
// Function to add differences to the map
function addDifferencesToMap(map) {
    differences.forEach(function(difference) {
        var marker = L.marker(map.unproject(difference.coords, map.getMaxZoom()), {
            icon: L.divIcon({ className: 'difference-marker' }) // An invisible icon
        });
        
        marker.addEventListener('click', function() {
            // Call this when the difference is clicked
            differenceFound(marker);
            marker.remove(); // Remove the marker or hide it
        });
        
        marker.addTo(map);
    });
}


// DOMContentLoaded event ensures the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize the maps and add event listeners
    // Maps initialization code...
    // Initialize the first map
    var map1 = L.map('image-container-1', {
        center: [0, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 4,
        crs: L.CRS.Simple,
        zoomControl: false, // Custom zoom controls will be added later
        attributionControl: false // Hide the default attribution
    });

    // Initialize the second map
    var map2 = L.map('image-container-2', {
        center: [0, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 4,
        crs: L.CRS.Simple,
        zoomControl: false, // Custom zoom controls will be added later
        attributionControl: false // Hide the default attribution
    });

    // Assuming you have a dimensions variable for your images
    var dimensions = [1920, 1920]; // Replace with your image dimensions
    var bounds1 = new L.LatLngBounds(
        map1.unproject([0, dimensions[1]], map1.getMaxZoom()),
        map1.unproject([dimensions[0], 0], map1.getMaxZoom())
    );
    var bounds2 = new L.LatLngBounds(
        map2.unproject([0, dimensions[1]], map2.getMaxZoom()),
        map2.unproject([dimensions[0], 0], map2.getMaxZoom())
    );

    // Set the maxBounds and maxBoundsViscosity for both maps
    map1.setMaxBounds(bounds1);
    map1.options.maxBoundsViscosity = 1.0;
    map2.setMaxBounds(bounds2);
    map2.options.maxBoundsViscosity = 1.0;

    // Add the images to the maps
    L.imageOverlay('image1.jpg', bounds1).addTo(map1);
    L.imageOverlay('image2.jpg', bounds2).addTo(map2);


    // Sync the maps to each other for scrolling and zooming
    map1.sync(map2);
    map2.sync(map1);
    
    // Add differences to maps
    addDifferencesToMap(map1);
    addDifferencesToMap(map2);
    
    // Event listeners for game controls
    document.getElementById('start-game').addEventListener('click', function() {
        resetGame();
        startTimer();
        updateScore(0);
        // Additional logic for starting the game
    });

    document.getElementById('reset-game').addEventListener('click', resetGame);

    // Assuming map1 and map2 are your Leaflet map instances

    function customZoomIn() {
        if(map1 && map2) {
            map1.zoomIn();
            map2.zoomIn();
        }
    }
    
    function customZoomOut() {
        if(map1 && map2) {
            map1.zoomOut();
            map2.zoomOut();
        }
    }

    document.getElementById('zoom-in-btn').addEventListener('click', customZoomIn);
    document.getElementById('zoom-out-btn').addEventListener('click', customZoomOut);


    // var tempMarker = L.marker(map1.unproject([200, 300], map1.getMaxZoom()), {
    //     draggable: true
    // }).addTo(map1);
    
    // tempMarker.on('dragend', function(event) {
    //     var marker = event.target;
    //     var position = marker.getLatLng();
    //     var newCoords = map1.project(position, map1.getMaxZoom());
    //     console.log("New Coordinates: ", newCoords);
    // });
});



