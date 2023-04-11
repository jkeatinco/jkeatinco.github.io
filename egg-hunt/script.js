// script.js
const gameContainer = document.querySelector('.game-container');
const bunny = document.querySelector('.bunny');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const videoUrl = "https://www.youtube.com/embed/7rjbYU8bNhQ?rel=0";
const eggCollectSound = document.getElementById('eggCollectSound');
const audioControl = document.getElementById('audioControl');
const startBtn = document.getElementById('startBtn');




const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

let bunnyPosition = 0;
let score = 0;
let audioEnabled = false;
audioControl.addEventListener('click', () => {
    audioEnabled = !audioEnabled;

    if (audioEnabled) {
        audioControl.querySelector('.fa-volume-mute').style.display = 'none';
        audioControl.querySelector('.fa-volume-up').style.display = 'inline';
    } else {
        audioControl.querySelector('.fa-volume-mute').style.display = 'inline';
        audioControl.querySelector('.fa-volume-up').style.display = 'none';
    }
});

function startGame() {
    startBtn.style.display = 'none';
    requestAnimationFrame(createEggs);
    requestAnimationFrame(dropEggs);
}

startBtn.addEventListener('click', () => {
    unlockAudioContext(); // Add this line
    startGame();
});


function playEggCollectSound() {
    if (audioEnabled) {
        eggCollectSound.currentTime = 0;
        eggCollectSound.play();
    }
}

function playEggCollectSound() {
    eggCollectSound.currentTime = 0;
    eggCollectSound.play();
}

function resetGame() {
    bunny.style.width = '50px';
    bunny.style.height = '50px';
    bunnyPosition = 0;
    bunny.style.left = bunnyPosition + 'px';
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
}

function createEgg() {
    const egg = document.createElement('div');
    const randomIndex = Math.floor(Math.random() * colors.length);
    egg.style.backgroundColor = colors[randomIndex];
    egg.style.position = 'absolute';
    egg.style.width = '25px';
    egg.style.height = '35px';
    egg.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
    egg.style.top = '-35px';
    egg.style.left = Math.floor(Math.random() * (gameContainer.clientWidth - 25)) + 'px';
    egg.classList.add('egg');
    gameContainer.appendChild(egg);
}

const eggCreationInterval = 500;
let lastEggCreationTime = 0;

function createEggs(currentTime) {
    if (currentTime - lastEggCreationTime > eggCreationInterval) {
        createEgg();
        lastEggCreationTime = currentTime;
    }
    if (gameOverElement.style.display !== 'block') {
        requestAnimationFrame(createEggs);
    }
}



let lastTime = 0;
const dropSpeed = 0.15;

function dropEggs(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const eggs = document.querySelectorAll('.egg');
    eggs.forEach(egg => {
        const rect = egg.getBoundingClientRect();
        if (rect.top > gameContainer.clientHeight) {
            gameContainer.removeChild(egg);
            return;
        }

        const bunnyRect = bunny.getBoundingClientRect();
        if (rect.left + rect.width > bunnyRect.left && rect.left < bunnyRect.left + bunnyRect.width && rect.top + rect.height > bunnyRect.top) {
            gameContainer.removeChild(egg);
           createExplosion(egg.style.backgroundColor, rect.left, rect.top);
            bunny.style.width = parseInt(bunny.style.width) + 5 + 'px';
            bunny.style.height = parseInt(bunny.style.height) + 5 + 'px';
            score++;
            scoreElement.textContent = score;
            eggCollectSound.currentTime = 0;
            playEggCollectSound();

            if (score >= 10) {
                gameOverElement.style.display = 'block';
                document.getElementById('youtubeVideo').src = videoUrl;
                return;
            }
        }

        egg.style.top = rect.top + (deltaTime * dropSpeed) + 'px';
    });

    if (gameOverElement.style.display !== 'block') {
        requestAnimationFrame(dropEggs);
    }
}

// function moveBunny(direction) {
//     if (direction === 'left') {
//         bunnyPosition -= 10;
//     } else if (direction === 'right') {
//         bunnyPosition += 10;
//     }

//     if (bunnyPosition < 0) {
//         bunnyPosition = 0;
//     } else if (bunnyPosition > gameContainer.clientWidth - parseInt(bunny.style.width)) {
//         bunnyPosition = gameContainer.clientWidth - parseInt(bunny.style.width);
//     }

//     bunny.style.left = bunnyPosition + 'px';
// }

let moveInterval;

function moveBunny(direction) {
    clearInterval(moveInterval);
    moveInterval = setInterval(() => {
        if (direction === 'left') {
            bunnyPosition -= 5;
        } else if (direction === 'right') {
            bunnyPosition += 5;
        }

        if (bunnyPosition < 0) {
            bunnyPosition = 0;
        } else if (bunnyPosition > gameContainer.clientWidth - parseInt(bunny.style.width)) {
            bunnyPosition = gameContainer.clientWidth - parseInt(bunny.style.width);
        }

        bunny.style.left = bunnyPosition + 'px';
    }, 25);
}

// Add this function to create an explosion effect
function createExplosion(color, x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.backgroundColor = color;
    explosion.style.left = x + 'px';
    explosion.style.top = y + 'px';
    gameContainer.appendChild(explosion);

    setTimeout(() => {
        gameContainer.removeChild(explosion);
    }, 500);
}

// Add this function to remove all eggs
function clearEggs() {
    const eggs = document.querySelectorAll('.egg');
    eggs.forEach(egg => {
        gameContainer.removeChild(egg);
    });
}

// function to unlock audio context
function unlockAudioContext() {
    if (typeof eggCollectSound.context !== 'undefined' && eggCollectSound.context.state === 'suspended') {
      eggCollectSound.context.resume();
    }
  }
  



leftBtn.addEventListener('touchstart', () => moveBunny('left'));
rightBtn.addEventListener('touchstart', () => moveBunny('right'));

leftBtn.addEventListener('mousedown', () => moveBunny('left'));
rightBtn.addEventListener('mousedown', () => moveBunny('right'));

leftBtn.addEventListener('mouseup', () => clearInterval(moveInterval));
rightBtn.addEventListener('mouseup', () => clearInterval(moveInterval));

restartBtn.addEventListener('click', () => {
    document.getElementById('youtubeVideo').src = "";
    clearEggs();
    resetGame();
    dropEggsInterval = setInterval(() => {
        createEgg();
        dropEggs();
    }, 500);
});

// Replace the existing setInterval call with the following variable
let dropEggsInterval = setInterval(() => {
    createEgg();
    dropEggs();
    requestAnimationFrame(createEggs);
}, 500);

document.addEventListener('touchstart', function unlockAudioContext() {
    if (typeof eggCollectSound.context !== 'undefined' && eggCollectSound.context.state === 'suspended') {
        eggCollectSound.context.resume();
    }
    document.removeEventListener('touchstart', unlockAudioContext);
});