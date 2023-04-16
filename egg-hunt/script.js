// script.js
const gameContainer = document.querySelector('.game-container');
const bunny = document.querySelector('.bunny');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const videoUrl = "https://www.youtube.com/embed/7rjbYU8bNhQ?rel=0";
const gameTitle = document.getElementById('gameTitle');
// const eggCollectSound = document.getElementById('eggCollectSound');
const eggCollectSound = new Howl({
    src: ['audio/egg_collect.mp3'],
    autoplay: false,
    loop: false,
    volume: 1,
    html5: true,
  });

  const backgroundMusic = new Howl({
    src: ['audio/background_music.mp3'],
    autoplay: false,
    loop: true,
    volume: 0.5,
    html5: true,
});
  
const audioControl = document.getElementById('audioControl');
const startBtn = document.getElementById('startBtn');





const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

let bunnyPosition = 0;
let score = 0;
let audioEnabled = true;
let userInteracted = false;

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
    gameTitle.style.display = 'none';
    requestAnimationFrame(createEggs);
    requestAnimationFrame(dropEggs);

    // Play the background music
    if (audioEnabled && userInteracted) {
        backgroundMusic.play();
    }
}



function playEggCollectSound() {
    if (audioEnabled && userInteracted) {
      eggCollectSound.play();
    }
  }

function resetGame() {
    bunny.style.width = '50px';
    bunny.style.height = '50px';
    bunnyPosition = 0;
    bunny.style.left = bunnyPosition + 'px';
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    if (audioEnabled && userInteracted) {
        backgroundMusic.play();
    }
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
            createExplosion(egg.style.backgroundColor, parseInt(egg.style.left), parseInt(egg.style.top));
            bunny.style.width = parseInt(bunny.style.width) + 15 + 'px';
            bunny.style.height = parseInt(bunny.style.height) + 15 + 'px';
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

    if (gameOverElement.style.display === 'block') {
        // Stop the background music
        backgroundMusic.stop();
    } else {
        requestAnimationFrame(dropEggs);
    }

    // if (gameOverElement.style.display !== 'block') {
    //     requestAnimationFrame(dropEggs);
    // }
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

    let scaleFactor = 1;
    let fadeOut = 1;
    const explosionEffect = setInterval(() => {
        scaleFactor += 0.1;
        fadeOut -= 0.05;
        explosion.style.transform = `scale(${scaleFactor})`;
        explosion.style.opacity = fadeOut;

        if (fadeOut <= 0) {
            clearInterval(explosionEffect);
            gameContainer.removeChild(explosion);
        }
    }, 20);
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

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeColors() {
    // Change the background color of the website
    document.body.style.backgroundColor = getRandomColor();

    // Change the color of the eggs
    const eggs = document.querySelectorAll('.egg');
    eggs.forEach(egg => {
        egg.style.backgroundColor = getRandomColor();
    });
}

  



startBtn.addEventListener('click', () => {
    userInteracted = true;
    unlockAudioContext();
    startGame();
    startGameLoop();
});

leftBtn.addEventListener('touchstart', () => {
    userInteracted = true;
    moveBunny('left');
});
rightBtn.addEventListener('touchstart', () => {
    userInteracted = true;
    moveBunny('right');
});

leftBtn.addEventListener('mousedown', () => {
    userInteracted = true;
    moveBunny('left');
});
rightBtn.addEventListener('mousedown', () => {
    userInteracted = true;
    moveBunny('right');
});

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
// let dropEggsInterval = setInterval(() => {
//     createEgg();
//     dropEggs();
//     requestAnimationFrame(createEggs);
// }, 500);

function startGameLoop() {
    requestAnimationFrame(createEggs);
    requestAnimationFrame(dropEggs);
}

function playSilentBuffer() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const buffer = context.createBuffer(1, 1, 22050);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
  }

document.addEventListener('touchstart', playSilentBuffer, { once: true });
document.addEventListener('mousedown', playSilentBuffer, { once: true });

  

document.addEventListener('touchstart', function unlockAudioContext() {
    if (typeof eggCollectSound.context !== 'undefined' && eggCollectSound.context.state === 'suspended') {
        eggCollectSound.context.resume();
    }
    document.removeEventListener('touchstart', unlockAudioContext);
});

setInterval(changeColors, 500);
