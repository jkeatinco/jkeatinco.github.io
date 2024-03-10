// Import the required functions from transformers.js
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0';

// Since we will download the model from the Hugging Face Hub, disable local model checks
env.allowLocalModels = false;

// Reference the DOM elements we will interact with
const status = document.getElementById('status');
const fileUpload = document.getElementById('file-upload');
const imageContainer = document.getElementById('image-container');
const fancyStatus = document.getElementById('fancy-status');
const timerElement = document.getElementById('timer');

let itemsToFind = ['elephant', 'item2', 'item3', 'item4', 'item5'];
let gameStarted = false;
let gameTimer = null;

// Initialize the object detection pipeline and set status
async function loadModel() {
    status.textContent = 'Loading model...';
    const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
    status.textContent = 'Ready';
    fancyStatus.style.display = 'none';
    return detector;
}

// The model loader is called immediately to load the model
const detectorPromise = loadModel();

fileUpload.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (e2) {
        imageContainer.innerHTML = '';
        const image = document.createElement('img');
        image.src = e2.target.result;
        imageContainer.appendChild(image);
        detect(image);

        // Ensure the game starts upon image load
        if (!gameStarted) {
            gameStarted = true;
            startGame();
        }
    };
    reader.readAsDataURL(file);
});

// Rest of the game logic remains the same



function startGame() {
    let timeLeft = 60;
    timerElement.textContent = `Time left: ${timeLeft} seconds`;

    gameTimer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft} seconds`;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    clearInterval(gameTimer);
    gameStarted = false;
    if (won) {
        status.textContent = 'You won!';
    } else {
        status.textContent = 'You lost!';
    }
}


// Detect objects in the image
async function detect(img) {
    status.textContent = 'Analysing...';
    const output = await detector(img.src, {
        threshold: 0.5,
        percentage: true,
    });
    status.textContent = '';
    output.forEach(renderBox);
    output.forEach(itemCheck);
    console.log("output", output);
}

// Render a bounding box and label on the image
function renderBox({ box, label }) {
    const { xmax, xmin, ymax, ymin } = box;

    // Generate a random color for the box
    const color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, 0);

    // Draw the box
    const boxElement = document.createElement('div');
    boxElement.className = 'bounding-box';
    Object.assign(boxElement.style, {
        borderColor: color,
        left: 100 * xmin + '%',
        top: 100 * ymin + '%',
        width: 100 * (xmax - xmin) + '%',
        height: 100 * (ymax - ymin) + '%',
    });

    // Draw label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.className = 'bounding-box-label';
    labelElement.style.backgroundColor = color;

    boxElement.appendChild(labelElement);
    imageContainer.appendChild(boxElement);
}
