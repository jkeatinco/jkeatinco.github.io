let strikes = 0;
let timeLeft = 60; // in seconds
let timer;

const differences = [
    { x: 2583.00, y: 2687.00, width: 82, height: 72 },
    { x: 2048.00, y: 2700.00, width: 67, height: 102 }
    // ... other differences
];

function startGame() {
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    document.getElementById('timer').textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
        endGame("Time's up!");
    }
}

function checkDifference(event, imageId) {

    if (isCorrectSpot(event, imageId)) {
        // Logic for correct spot
        console.log("Correct spot!");

        // You can add more code here to handle what happens when the player finds a correct spot.
        // For example, marking the spot, updating a score, etc.
    } else {
        // Logic for wrong spot
        strikes++;
        document.getElementById('strikes').textContent = `Strikes: ${strikes}`;

        if (strikes >= 3) {
            endGame("Out of strikes!");
        }
    }
}

function isCorrectSpot(event, imageId) {
    const image = document.getElementById(imageId);
    const rect = image.getBoundingClientRect();

    // Calculate scaled click coordinates
    const scaleX = image.naturalWidth / rect.width;
    const scaleY = image.naturalHeight / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Check if the click is within any of the difference areas
    for (let diff of differences) {
        if (clickX >= diff.x && clickX <= diff.x + diff.width &&
            clickY >= diff.y && clickY <= diff.y + diff.height) {
            return true;
        }
    }
    return false;
}


function endGame(message) {
    clearInterval(timer);
    alert(message);
    // Reset game or navigate to game over screen.
}

function displayCorrectSpots() {
    const overlays = [document.getElementById('overlay1'), document.getElementById('overlay2')];
    
    overlays.forEach((overlay, index) => {
        const image = document.getElementById(`image${index + 1}`);
        const rect = image.getBoundingClientRect();
        const scaleX = image.naturalWidth / rect.width;
        const scaleY = image.naturalHeight / rect.height;

        differences.forEach(diff => {
            const spot = document.createElement('div');
            spot.style.left = (diff.x / scaleX) + 'px';
            spot.style.top = (diff.y / scaleY) + 'px';
            spot.style.width = (diff.width / scaleX) + 'px';
            spot.style.height = (diff.height / scaleY) + 'px';
            overlay.appendChild(spot);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startGame();
    displayCorrectSpots(); // Call this function to display the overlays
});

