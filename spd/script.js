let strikes = 0;
let timeLeft = 60; // in seconds
let timer;

const differences = [
    { x: 2583.00, y: 2687.00, width: 82, height: 72, found: false },
    { x: 2048.00, y: 2700.00, width: 67, height: 102, found: false }
    // ... other differences
];

function startGame() {
    timer = setInterval(updateTimer, 1000);
    displayCorrectSpots(); // Ensure images are loaded before displaying spots
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
        console.log("Correct spot!");
    } else {
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
    const scaleX = image.naturalWidth / rect.width;
    const scaleY = image.naturalHeight / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    for (let diff of differences) {
        if (!diff.found && clickX >= diff.x && clickX <= (diff.x + diff.width) &&
            clickY >= diff.y && clickY <= (diff.y + diff.height)) {
            diff.found = true;
            console.log(differences);
            showSparkleAnimation(event.clientX, event.clientY);
            return true;
        }
    }
    return false;
}


function showSparkleAnimation(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = (x - 25) + 'px'; // Adjusted for animation size
    sparkle.style.top = (y - 25) + 'px'; // Adjusted for animation size
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
}

function endGame(message) {
    clearInterval(timer);
    alert(message);
    // Reset game or navigate to game over screen.
}

function displayCorrectSpots() {
    const images = [document.getElementById('image1'), document.getElementById('image2')];
    images.forEach((image, index) => {
        // Wait for the image to load to get accurate dimensions
        const handleImageLoad = () => {
            const rect = image.getBoundingClientRect();
            const scaleX = image.naturalWidth / rect.width;
            const scaleY = image.naturalHeight / rect.height;
            const overlay = document.getElementById(`overlay${index + 1}`);
            overlay.innerHTML = ''; // Clear previous spots

            differences.forEach(diff => {
                if (!diff.found) {
                    const spot = document.createElement('div');
                    spot.style.position = 'absolute';
                    // Adjust positions based on the scale
                    spot.style.left = (rect.left + (diff.x / scaleX)) + 'px';
                    spot.style.top = (rect.top + (diff.y / scaleY)) + 'px';
                    spot.style.width = (diff.width / scaleX) + 'px';
                    spot.style.height = (diff.height / scaleY) + 'px';
                    spot.style.border = '2px solid red'; // For visibility
                    document.body.appendChild(spot); // Append to body to avoid relative positioning issues
                }
            });
        };

        if (image.complete) {
            handleImageLoad();
        } else {
            image.addEventListener('load', handleImageLoad);
        }
    });
}



// Wait for images to load before starting the game
window.onload = startGame;
