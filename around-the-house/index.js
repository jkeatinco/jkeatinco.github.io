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
  const itemElement = document.createElement('button');
  const iconElement = document.createElement('i');
  
  // Assign different icons based on the item
  if (item === 'television') {
    iconElement.className = 'fa-solid fa-tv';
  } else if (item === 'plant') {
    iconElement.className = 'fa-solid fa-plant-wilt';
  } else if (item === 'table') {
    iconElement.className = 'fa-solid fa-table';
  } else if (item === 'cup') {
    iconElement.className = 'fa-solid fa-mug-hot';
  } else if (item === 'chair') {
    iconElement.className = 'fa-solid fa-chair';
  }
  itemElement.innerHTML = item + '&nbsp;';
  itemElement.id = `item-${item}`;
  itemElement.className = 'glowbtn';
  


  // Append the icon to the button
  itemElement.appendChild(iconElement);
  
  itemsDiv.appendChild(itemElement);
});



const candidate_labels = ['television', 'plant', 'table', 'cup', 'chair'];

modelStatus.textContent = 'Summoning the AI magic... ✨';
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
        fancyStatus.style.display = 'flex';
        modelStatus.textContent = 'Hmmm... 🤔 data magic is happening...';
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
        itemElement.classList.add('found');
        itemsToFind = itemsToFind.filter((item) => item !== label);
        
        openModalAndPopulate(label);
        
        console.log(itemsToFind)
        if (itemsToFind.length === 0) {
            if (gameStarted) {
                clearInterval(gameTimer);
                endGame(true);
                gameStarted = false;
            }
        }
    }
}

function openModalAndPopulate(item) {
  // Get the modal element
  const modal = document.getElementById('found-items-modal');
  
  modal.className = '';
  modal.classList.add('two');
  document.body.classList.add('modal-active');

  // Get the element in the modal where the found items are to be displayed
  const foundItemsElement = document.getElementById('found-items');

  // Append the found item to the list of found items in the modal
  const listItem = document.createElement('li');
  
  // Create Font Awesome icon
  const iconElement = document.createElement('i');

  // Assign different icons based on the item
  if (item === 'television') {
    iconElement.className = 'fa-solid fa-tv';
  } else if (item === 'plant') {
    iconElement.className = 'fa-solid fa-plant-wilt';
  } else if (item === 'table') {
    iconElement.className = 'fa-solid fa-table';
  } else if (item === 'cup') {
    iconElement.className = 'fa-solid fa-mug-hot';
  } else if (item === 'chair') {
    iconElement.className = 'fa-solid fa-chair';
  }

  listItem.textContent = item + ' ';
  listItem.appendChild(iconElement);
  foundItemsElement.appendChild(listItem);
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
        
        left: 100 * xmin + '%',
        top: 100 * ymin + '%',
        width: 100 * (xmax - xmin) + '%',
        height: 100 * (ymax - ymin) + '%',
    });

    // Draw label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.className = 'bounding-box-label';

    // Create Font Awesome icon
    const iconElement = document.createElement('i');
    

        // Assign different icons based on the item
    if (label === 'television') {
        iconElement.className = 'fa-solid fa-tv';
    } else if (label === 'plant') {
        iconElement.className = 'fa-solid fa-plant-wilt';
    } else if (label === 'table') {
        iconElement.className = 'fa-solid fa-table';
    } else if (label === 'cup') {
        iconElement.className = 'fa-solid fa-mug-hot';
    } else if (label === 'chair') {
        iconElement.className = 'fa-solid fa-chair';
  }
    labelElement.innerHTML = label + '&nbsp;';
    // Add icon to label
    labelElement.appendChild(iconElement);
    

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
      fancyStatus.style.display = 'flex';
      modelStatus.textContent = 'You Won!';
  } else {
      fancyStatus.style.display = 'flex';
      modelStatus.textContent = 'You Lost!';
  }

  // Create restart button
  var restartButton = document.createElement('button');
  restartButton.textContent = 'Restart Game';
  restartButton.onclick = restartGame; // restartGame is a function you need to implement

  // Add class to the button
  restartButton.classList.add('restart-button');

  // Append restart button to fancyStatus
  fancyStatus.appendChild(restartButton);
}

function restartGame() {
  // Reset game variables
  score = 0;
  itemsToFind = ['television', 'plant', 'table', 'cup', 'chair'];
  gameStarted = false;
  gameTimer = null;

  // Clear the image container
  imageContainer.innerHTML = '';

  // Reset the score display
  scoreElement.textContent = `Score: ${score}`;

  // Reset the timer display
  timerElement.textContent = `Time left: 60 seconds`;

  // Reset the status display
  modelStatus.textContent = 'Ready';
  fancyStatus.style.display = 'none';

  // Remove the restart button
  const restartButton = document.querySelector('#fancy-status button');
  if (restartButton) {
      fancyStatus.removeChild(restartButton);
  }

  // Reset the items display
  const itemElements = document.querySelectorAll('#items button');
  itemElements.forEach((itemElement) => {
      itemElement.style.textDecoration = 'none';
      itemElement.classList.remove('found');
  });

  // Reset the found items modal
  const foundItemsElement = document.getElementById('found-items');
  foundItemsElement.innerHTML = '';

   // Close the modal if it's open
   if (document.body.classList.contains('modal-active')) {
    document.getElementById('found-items-modal').click();
  }


  // Start a new game
  // startGame();
}
