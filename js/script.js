const eat = new Audio('music/eat.mp3');
const gameover = new Audio('music/gameover.mp3');
const move = new Audio('music/move.mp3');

let r = 40, c = 40;
let inputcord = { x: 0, y: 0 };
let lastPaintTime = 0;
let speed = 13;
let score = 0;
// snake Array
let snakeArr = [
    { x: getRndInteger(5, c - 5), y: getRndInteger(5, r - 5) }
];
// food Object
// let food = { x: 5, y: 7 };
let food = { x: getRndInteger(5, c - 5), y: getRndInteger(5, r - 5) };
// key array
let keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "s", "a", "d", "W", "S", "A", "D"];

let gamebox = document.getElementById("gamebox");
gamebox.style.gridTemplate = "repeat(" + r + ", auto)/ repeat(" + c + ", auto)";
let scoreBox = document.getElementById("scoreBox");
let hiscoreBox = document.getElementById("hiscoreBox");

let hiscore = localStorage.getItem("hiscore");
// console.log(hiscore);
if (hiscore === null) {
    hiscore = 0;
    localStorage.setItem("hiscore", hiscore);
}
else {
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

// get random integers
// This JavaScript function always returns a random number between min (included) and max (excluded):
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// main function
function main(timestamp) {
    window.requestAnimationFrame(main);
    // console.log(timestamp);
    if ((timestamp - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = timestamp;
    gameLoop();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            // gameover.play();
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= c + 1 || snake[0].x <= 0 || snake[0].y >= r + 1 || snake[0].y <= 0) {
        // gameover.play();
        return true;
    }

    return false;
}

function gameLoop() {
    // if the snake is Collide
    if (isCollide(snakeArr)) {
        // gameover.play();
        inputcord = { x: 0, y: 0 };
        snakeArr = [
            { x: getRndInteger(5, c - 5), y: getRndInteger(5, r - 5) }
        ];
        gameOver();
    }

    // display the snake
    gamebox.innerHTML = "";
    snakeArr.forEach((elmnt, index) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = elmnt.y;
        snakeElement.style.gridColumnStart = elmnt.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }

        gamebox.appendChild(snakeElement);

    });

    // display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gamebox.appendChild(foodElement);

    // move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputcord.x;
    snakeArr[0].y += inputcord.y;

    // If the snake have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].x == food.x && snakeArr[0].y == food.y) {
        eat.play();
        score++;
        if (score > hiscore) {
            hiscore = score;
            localStorage.setItem("hiscore", hiscore);
        }
        snakeArr.unshift({ x: snakeArr[0].x + inputcord.x, y: snakeArr[0].y + inputcord.y });
        // console.log("eaten");
        // update the food position
        food = { x: getRndInteger(5, c - 5), y: getRndInteger(5, r - 5) };
    }

    // update the score
    scoreBox.innerHTML = "Score: " + score;
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
// get keyboard inputs
window.addEventListener("keydown", keyinput);

function keyinput(event) {
    // var key = event.key;
    if (keys.includes(event.key)) {
        move.play();
    }
    console.log(event.key);
    switch (event.key) {
        case "w":
        case "W":
        case "ArrowUp":
            inputcord.x = 0;
            inputcord.y = -1;
            break;

        case "s":
        case "S":
        case "ArrowDown":
            inputcord.x = 0;
            inputcord.y = 1;
            break;

        case "a":
        case "A":
        case "ArrowLeft":
            inputcord.x = -1;
            inputcord.y = 0;
            break;

        case "d":
        case "D":
        case "ArrowRight":
            inputcord.x = 1;
            inputcord.y = 0;
            break;

        default:
            break;
    }
};

function gameOver() {
    window.removeEventListener("keydown", keyinput);
    $("#gameOverModal").modal('show');
    // gameover.pause();
    gameover.play();
    return;
}

function RestartGame() {
    window.addEventListener('keydown', keyinput);
    score = 0;
    snakeArr = [
        { x: getRndInteger(5, c - 5), y: getRndInteger(5, r - 5) }
    ];
}
