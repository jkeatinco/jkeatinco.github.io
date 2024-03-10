// index.js
const status = document.getElementById('status');
const fileUpload = document.getElementById('file-upload');
const imageContainer = document.getElementById('image-container');
const fancyStatus = document.getElementById('fancy-status');
const timerElement = document.getElementById('timer');

let itemsToFind = ['television', 'fan', 'lamp', 'water bottle', 'elephant'];
let gameStarted = false;
let gameTimer = null;

const itemsContainer = document.getElementById('items');

itemsToFind.forEach(item => {
    const listItem = document.createElement('div');
    listItem.id = item; 
    listItem.textContent = item;
    itemsContainer.appendChild(listItem);
});

const candidate_labels = ['television', 'fan', 'lamp', 'water bottle', 'elephant'];

status.textContent = 'Loading model...';
const worker = new Worker('worker.js');
worker.postMessage({ cmd: 'init' });

worker.onmessage = (event) => {
  switch (event.data.status) {
    case 'ready':
      status.textContent = 'Ready';
      fancyStatus.style.display = 'none';
      break;
    case 'result':
      fancyStatus.style.display = 'none';
      status.textContent = '';
      event.data.output.forEach(renderBox);
      event.data.output.forEach(findItem);
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
        worker.postMessage({ cmd: 'detect', imgSrc: image.src, candidate_labels });
    };
    reader.readAsDataURL(file);
});

// Rest of the code remains the same...


// Detect objects in the image
async function detect(img) {
    fancyStatus.style.display = 'block';
    status.textContent = 'Analysing...';
    const output = await detector(img.src, candidate_labels);
    fancyStatus.style.display = 'none';
    status.textContent = '';
    output.forEach(renderBox);
    output.forEach(findItem);
}

function findItem({ label }) {
    if (itemsToFind.includes(label)) {
        // label.style.display = 'none';
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
