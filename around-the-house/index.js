// index.js
const modelStatus = document.getElementById('status');
const fileUpload = document.getElementById('file-upload');
const imageContainer = document.getElementById('image-container');
const fancyStatus = document.getElementById('fancy-status');
const timerElement = document.getElementById('timer');

let score = 0; // Add this line
const scoreElement = document.getElementById('score'); // Add this line

let itemsToFind = ['television', 'plant', 'table', 'cup', 'chair'];
let gameStarted = false;
let gameTimer = null;

const itemsDiv = document.getElementById('items');
itemsToFind.forEach((item) => {
  const itemElement = document.createElement('div');
  itemElement.textContent = item;
  itemElement.id = `item-${item}`;
  itemsDiv.appendChild(itemElement);
});



const candidate_labels = ['television', 'plant', 'table', 'cup', 'chair'];

modelStatus.textContent = 'Loading model...';
const worker = new Worker('worker.js', { type: 'module' });
worker.postMessage({ cmd: 'init' });

// index.js
worker.onmessage = (event) => {
    switch (event.data.status) {
      case 'ready':
        console.log('Received ready message'); // Add this line
        modelStatus.textContent = 'Ready';
        fancyStatus.style.display = 'none';
        break;
      case 'result':
        fancyStatus.style.display = 'none';
        modelStatus.textContent = '';
        event.data.output.forEach(renderBox);
        event.data.output.forEach(findItem);
        break;
      case 'error':
        console.error('Error in worker:', event.data.message);
        modelStatus.textContent = 'Error loading model';
        break;
    }
  };

fileUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e2) {
        imageContainer.innerHTML = '';
        const image = document.createElement('img');
        image.src = e2.target.result;
        imageContainer.appendChild(image);
        fancyStatus.style.display = 'block';
        modelStatus.textContent = 'Analysing...';
        worker.postMessage({ cmd: 'detect', imgSrc: image.src, candidate_labels });
          // Ensure the game starts upon image load
          if (!gameStarted) {
            gameStarted = true;
            startGame();
        }
    };
    reader.readAsDataURL(file);
});

// Rest of the code remains the same...


// Detect objects in the image
// async function detect(img) {
//     fancyStatus.style.display = 'block';
//     modelStatus.textContent = 'Analysing...';
//     const output = await detector(img.src, candidate_labels);
//     fancyStatus.style.display = 'none';
//     modelStatus.textContent = '';
//     output.forEach(renderBox);
//     output.forEach(findItem);
// }

function findItem({ label }) {
    if (itemsToFind.includes(label)) {
        // label.style.display = 'none';
        score++; // Increment score
        scoreElement.textContent = `Score: ${score}`; // Update score display
        const itemElement = document.getElementById(`item-${label}`);
        itemElement.style.textDecoration = 'line-through';
        itemsToFind = itemsToFind.filter((item) => item !== label);
        
        console.log(itemsToFind)
        if (itemsToFind.length === 0) {
            if (gameStarted) {
                clearInterval(gameTimer);
                alert('You found all the items!');
                gameStarted = false;
            }
        }
    }
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

function startGame() {
    score = 0; // Reset score
    scoreElement.textContent = `Score: ${score}`; // Update score display
   

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
        fancyStatus.style.display = 'block';
        modelStatus.textContent = 'You Won!';
    } else {
        fancyStatus.style.display = 'block';
        modelStatus.textContent = 'You Lost!';
    }
}
