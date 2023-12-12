// Constants
const tickInterval = 10;
const shipSpeedPixelsPerSec = 300;
const shotSpeedPixelsPerSec = 800;
const invaderSpeedPixelsPerSec = 75;
const maxShots = 4;

// Elements
let ship;
let score;

// States
let shooting = 0;
let moveright = 0;
let moveleft = 0;
let wavesCleared = 0;
let shots = []; // holds HTML shot elements
let invaders = []; // holds HTML invader elements
let invadersMovingRight;

// Timer
let tickTimer;

// Initialization
window.addEventListener('load', initializeGame);

function initializeGame() {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    tickTimer = setInterval(tick, tickInterval);
    createInvaders();
    createShip();
    createScore();
}

function handleKeyDown(e) {
    switch (e.key) {
        case 'ArrowRight':
            moveright = 1;
            break;
        case 'ArrowLeft':
            moveleft = 1;
            break;
        case ' ':
        case 'ArrowUp':
            if (!shooting) {
                shooting = 1;
                shoot();
            }
            break;
        case 'l':
            doThing();
            break;
    }
}

function handleKeyUp(e) {
    console.log(e);
    switch (e.key) {
        case 'ArrowRight':
            moveright = 0;
            break;
        case 'ArrowLeft':
            moveleft = 0;
            break;
        case ' ':
        case 'ArrowUp':
            shooting = 0;
            break;
    }
}

function tick() {
    const thisTickTime = Date.now();
    if (!this.previousTime) {
        this.previousTime = thisTickTime;
        return;
    }
    const elapsedSec = (thisTickTime - this.previousTime) / 1000;
    animateShip(elapsedSec);
    animateShots(elapsedSec);
    animateInvaders(elapsedSec);
    checkForCollisions();
    removeStaleShots();
    removeStaleInvaders();
    checkForVictory();
    this.previousTime = thisTickTime;
}

function shoot() {
    if (shots.length >= maxShots) return;
    const newShot = document.createElement('div');
    newShot.classList.add('shot');
    newShot.innerHTML = '|';
    document.body.appendChild(newShot);
    newShot.style.left = `${getElementLeft(ship)}px`;
    newShot.style.top = `${getElementTop(ship) - ship.offsetHeight}px`;
    shots.push(newShot);
}

function gameOver() {
    const text = document.createElement('div');
    text.classList.add('failure');
    text.innerHTML = 'YOU BLEW IT';
    document.body.appendChild(text);
    clearInterval(tickTimer);
}

function checkForVictory() {
    if (invaders.length < 1) {
        createInvaders();
        // var text = document.createElement('div'); // Unreachable code
        // text.classList.add('victory');
        // text.innerHTML = 'CONGRATULATIONS YOU HAVE SAVED THE PRINCESS';
        // document.body.appendChild(text);
        clearInterval(tickTimer);
    }
}

function animateShip(elapsedSec) {
    let delta = 0;
    if (moveright) {
        ship.style.color = 'blue';
        delta = shipSpeedPixelsPerSec * elapsedSec;
    }
    if (moveleft) {
        ship.style.color = 'green';
        delta = -shipSpeedPixelsPerSec * elapsedSec;
    }
    if (delta) {
        const proposedRight = getElementRight(ship) - delta;
        const proposedLeft = getElementLeft(ship) + delta;
        if (proposedRight < 0) {
            ship.style.left = null;
            ship.style.right = '0px';
        } else {
            ship.style.right = null;
            ship.style.left = `${Math.max(0, proposedLeft)}px`;
        }
    }
}

function animateShots(elapsedSec) {
    for (let i = 0; i < shots.length; ++i) {
        if (getElementTop(shots[i]) + shots[i].offsetHeight < 0) {
            shots[i].parentNode.removeChild(shots[i]);
            shots.splice(i, 1);
        } else {
            shots[i].style.top = `${getElementTop(shots[i]) - elapsedSec * shotSpeedPixelsPerSec}px`;
        }
    }
}

function animateInvaders(elapsedSec) {
    if (isNaN(this.time)) {
        this.time = 0;
    }
    this.time += elapsedSec;
    if (this.time > getInvaderAnimationDelay()) {
        this.time -= getInvaderAnimationDelay();
        let knownOffset = null;
        for (let i = 0; i < invaders.length; ++i) {
            if (invadersMovingRight) {
                invaders[i].style.left = `${getElementLeft(invaders[i]) + invaderSpeedPixelsPerSec}px`;
                if (getElementRight(invaders[i]) < 1) {
                    knownOffset = -Math.max(knownOffset, Math.abs(getElementRight(invaders[i])));
                }
            } else {
                invaders[i].style.left = `${getElementLeft(invaders[i]) - invaderSpeedPixelsPerSec}px`;
                if (getElementLeft(invaders[i]) < 1) {
                    knownOffset = Math.max(knownOffset, Math.abs(getElementLeft(invaders[i])));
                }
            }
            const styleToRemove = `invader${invaders[i].invaderStyle}${invaders[i].animationState ? '1' : '2'}`;
            invaders[i].classList.remove(styleToRemove);
            const styleToAdd = `invader${invaders[i].invaderStyle}${invaders[i].animationState ? '2' : '1'}`;
            invaders[i].classList.add(styleToAdd);
            invaders[i].animationState = !invaders[i].animationState;
        }
        if (knownOffset && knownOffset !== 0) {
            invadersMovingRight = !invadersMovingRight;
            for (let i = 0; i < invaders.length; ++i) {
                invaders[i].style.top = `${getElementTop(invaders[i]) + 60}px`;
                invaders[i].style.left = `${getElementLeft(invaders[i]) + knownOffset}px`;
            }
        }
    }
}

function getInvaderAnimationDelay() {
    return 0.1 + invaders.length / 40 - wavesCleared * 0.05;
}

function checkForCollisions() {
    for (let j = 0; j < invaders.length; ++j) {
        for (let i = 0; i < shots.length; ++i) {
            if (overlap(shots[i], invaders[j])) {
                shots[i].style.display = 'none';
                invaders[j].style.display = 'none';
                addPoints(invaders[j].pointValue);
            }
        }
        if (overlap(ship, invaders[j])) {
            gameOver();
            break;
        }
    }
}

function addPoints(points) {
    const newScore = parseInt(score.innerHTML) + points;
    score.innerHTML = '0'.repeat(Math.max(0, 6 - String(newScore).length)) + String(newScore);
}

