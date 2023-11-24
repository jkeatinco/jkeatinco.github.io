let originalDifferences = [{x: 1208, y: 1257}, {x: 952, y: 1234}]; // Original coordinates
let scaledDifferences = [];
let score = 0;
let timeLeft = 30; // Timer set for 30 seconds

// Function to calculate and apply scale factor
function calculateScaleFactor() {
    let gameImage = document.getElementById('image1'); // Adjust this to your game image ID
    let naturalWidth = gameImage.naturalWidth;
    let displayedWidth = gameImage.offsetWidth;
    let scaleFactor = displayedWidth / naturalWidth;

    console.log(`Natural Width: ${naturalWidth}, Displayed Width: ${displayedWidth}`);
    console.log(`Scale Factor: ${scaleFactor}`);

    scaledDifferences = originalDifferences.map(diff => {
        return {x: diff.x * scaleFactor, y: diff.y * scaleFactor};
    });
    console.log(`Scaled Differences: `, scaledDifferences);

    // Clear existing circles
    document.querySelectorAll('.difference-marker').forEach(marker => marker.remove());

    scaledDifferences.forEach(diff => {
        createDifferenceMarker(diff);
    });

}

function createDifferenceMarker(diff) {
    let marker = document.createElement('div');
    marker.className = 'difference-marker';
    marker.style.left = `${diff.x}px`;
    marker.style.top = `${diff.y}px`;
    document.getElementById('container2').appendChild(marker);
}


// Start the game and setup event listeners
document.addEventListener('DOMContentLoaded', () => {
    let gameImage = document.getElementById('image1');
    if (gameImage.complete) {
        calculateScaleFactor(); // The image is already loaded, calculate scale factor immediately
    } else {
        gameImage.onload = calculateScaleFactor; // The image is not yet loaded, wait for the load event
    }

    setInterval(updateTimer, 1000); // Update the timer every second
    document.getElementById('image2').addEventListener('click', checkDifference); // Adjust this to your clickable game image ID



    //Image maginification
    const magnifier = document.createElement('div');
    const magnificationFactor = 2; // Adjust the zoom level

    magnifier.id = 'magnifier';
    document.body.appendChild(magnifier); // Append to body to avoid overflow issues

    document.querySelectorAll('.game-image').forEach(image => {
        image.addEventListener('touchstart', function(e) {
            magnifier.style.display = 'block'; // Show magnifier
            updateMagnifier(e, image);
        });

        image.addEventListener('touchmove', e => updateMagnifier(e, image));

        image.addEventListener('touchend', function() {
            magnifier.style.display = 'none'; // Hide magnifier
        });
    });

    function updateMagnifier(e, image) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const imageRect = image.getBoundingClientRect();

        magnifier.style.left = (touchX - magnifier.offsetWidth / 2) + 'px';
        magnifier.style.top = (touchY - magnifier.offsetHeight / 2) + 'px';
        magnifier.style.backgroundImage = `url('${image.src}')`;
        magnifier.style.backgroundSize = `${imageRect.width * magnificationFactor}px ${imageRect.height * magnificationFactor}px`;
        magnifier.style.backgroundPosition = `-${(touchX - imageRect.left) * magnificationFactor - magnifier.offsetWidth / 2}px -${(touchY - imageRect.top) * magnificationFactor - magnifier.offsetHeight / 2}px`;
    }
});

// Function to update the timer
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;
    } else {
        document.getElementById('timer').innerText = 'Time is up! Game Over!';
        endGame();
    }
}





function checkDifference(event) {
    const clickX = event.offsetX;
    const clickY = event.offsetY;
    const tolerance = 5; // Tolerance in pixels

    console.log(clickX);
    console.log(clickY);

    for (let i = 0; i < scaledDifferences.length; i++) {
        const diff = scaledDifferences[i];

        // Check if the click coordinates are within the tolerance of the difference coordinates
        if (clickX >= (diff.x - tolerance) && clickX <= (diff.x + tolerance) &&
            clickY >= (diff.y - tolerance) && clickY <= (diff.y + tolerance)) {
            console.log('Difference found!');
            score += 10;
            document.getElementById('score').innerText = `Score: ${score}`;
            scaledDifferences.splice(i, 1); // Remove found difference
            break; // Exit the loop after finding a valid click
        }
    }

    if (scaledDifferences.length === 0) {
        console.log('All differences found! Game won!');
        endGame();
    }
}






// Function to handle the end of the game
function endGame() {
    console.log(`Game Over! Your score: ${score}`);
    // Here, you can display the score and offer options to restart or exit
}

// Add more functions as needed for game features
