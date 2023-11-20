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
    // Placeholder for checking the correct spot.
    // You need to define the logic to determine if the clicked spot is correct.

    if (isCorrectSpot(event, imageId)) {
        // Logic for correct spot
        console.log("Correct spot!");
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

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', startGame);
