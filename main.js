const world = document.getElementById('world');
const pen = world.getContext('2d');
const input = document.getElementById('size-input');
const submitButton = document.getElementById('submit');
const radioTrue = document.getElementById('true-walls');
const difficultyRadios = document.querySelectorAll('.difficulty');
const score = document.querySelector('.score-number');
const bestScore = document.querySelector('.best-score-number');
const minSize = Math.min(window.innerWidth, window.innerHeight);
let interval = null;
let tileSize = 20;
let tileCount = world.width / tileSize;
let startX = 0;
let endX = 0;
let startY = 0;
let endY = 0;
let velocity = {
    x: 0,
    y: 0
}
let food = {
    x: tileCount - 1,
    y: tileCount - 1
}
let snake = [];
let snakeHead = {
    x: tileCount / 2,
    y: tileCount / 2
}
let snakeLength = 1;
let isWalls = false;
const keyDownHandlers = {
    37: () => {
        velocity.x = -1;
        velocity.y = 0;
    },
    39: () => {
        velocity.x = 1;
        velocity.y = 0;
    },
    38: () => {
        velocity.x = 0;
        velocity.y = -1;
    },
    40: () => {
        velocity.x = 0;
        velocity.y = 1;
    },
    65: () => {
        velocity.x = -1;
        velocity.y = 0;
    },
    68: () => {
        velocity.x = 1;
        velocity.y = 0;
    },
    87: () => {
        velocity.x = 0;
        velocity.y = -1;
    },
    83: () => {
        velocity.x = 0;
        velocity.y = 1;
    }
}

function drawWorld() {
    pen.fillStyle = 'black';
    pen.fillRect(0, 0, world.width, world.height);
}

function drawSnake() {
    pen.fillStyle = 'green';

    for (let i = 0; i < snake.length; i++) {
        pen.fillRect(snake[i].x * tileSize, snake[i].y * tileSize, tileSize - 2, tileSize - 2);

        if (snake[i].x === snakeHead.x && snake[i].y === snakeHead.y) {
            snakeLength = 1;
            snakeHead = {
                x: tileCount / 2,
                y: tileCount / 2
            }
        }

    }
}

function drawFood() {
    pen.fillStyle = 'darkred';
    pen.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 2, tileSize - 2);
}

function updateSnakeHead() {
    snakeHead.x += velocity.x;
    snakeHead.y += velocity.y;
    if (!isWalls) {
        if (snakeHead.x < 0) snakeHead.x = tileCount - 1;
        if (snakeHead.x >= tileCount) snakeHead.x = 0;
        if (snakeHead.y < 0) snakeHead.y = tileCount - 1;
        if (snakeHead.y >= tileCount) snakeHead.y = 0;
    } else {
        if (snakeHead.x < 0 || snakeHead.x >= tileCount || snakeHead.y < 0 || snakeHead.y >= tileCount) {
            snakeLength = 1;
            snakeHead = {
                x: tileCount / 2,
                y: tileCount / 2
            }
        }
    }
}

function updateSnakeBody() {
    snake.push({
        x: snakeHead.x,
        y: snakeHead.y
    })

    while (snake.length > snakeLength) {
        snake.shift();
    }

    score.textContent = snakeLength;

    if (snakeLength > Number(bestScore.textContent)) bestScore.textContent = snakeLength;
}

function canEatFood() {
    if (food.x === snakeHead.x && food.y === snakeHead.y) {
        snakeLength++;
        let potentialFoodX = Math.floor(Math.random() * tileCount);
        let potentialFoodY = Math.floor(Math.random() * tileCount);
        let flag = true;

        while (true) {
            for (snakeTile of snake) {
                if (snakeTile.x === potentialFoodX && snakeTile.y === potentialFoodY) flag = false;
            }

            if (potentialFoodX === snakeHead.x && potentialFoodY === snakeHead.y) flag = false;
            if (flag) break;

            potentialFoodX = Math.floor(Math.random() * tileCount);
            potentialFoodY = Math.floor(Math.random() * tileCount);
            flag = true;
        }

        food.x = potentialFoodX;
        food.y = potentialFoodY;
    }
}

function onArrowsKeyDown(event) {
    if (keyDownHandlers.hasOwnProperty(event.keyCode)) keyDownHandlers[event.keyCode]();

}

function onEnterKeyDown(event) {
    if (event.code === 'Enter') {
        event.target.blur();
        onSubmitClick(event);
    }
}

function onSubmitClick(event) {
    event.preventDefault();
    isWalls = radioTrue.checked;

    if (input.value >= 200 && input.value < minSize && input.value % 20 === 0) {
        world.width = input.value;
        world.height = input.value;
        tileCount = world.width / tileSize;
        food = {
            x: tileCount - 1,
            y: tileCount - 1
        }
    } else alert('неверный размер поля');
    
    for (radio of difficultyRadios){
        if (radio.checked) difficulty = radio.id;
    }

    run();
}

function updateGame() {
    updateSnakeHead();
    drawWorld();
    drawSnake();
    canEatFood();
    drawFood();
    updateSnakeBody();
}

function run(){
    if (interval) clearInterval(interval);

    switch(difficulty){
        case 'low-difficulty':
            interval = setInterval(updateGame, 200);
            break;
        case 'mid-difficulty':
            interval = setInterval(updateGame, 100);
            break;
        case 'high-difficulty':
            interval = setInterval(updateGame, 50);
            break;
        default:
            interval = setInterval(updateGame, 100);
    }
}

function onTouchStart(event){
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

function onTouchMove(event){
    endX = event.touches[0].clientX;
    endY = event.touches[0].clientY;
}

function onTouchEnd(){
    const differenceX = startX - endX;
    const differenceY = startY - endY;

    if (Math.abs(differenceX) > 40){
        if (differenceX > 0) {
            velocity.x = -1;
            velocity.y = 0; 
        } else{
            velocity.x = 1;
            velocity.y = 0;
        }
    }

    if (Math.abs(differenceY) > 40){
        if (differenceY > 0) {
            velocity.x = 0;
            velocity.y = -1; 
        } else{
            velocity.x = 0;
            velocity.y = 1;
        }
    }
}

submitButton.addEventListener('click', onSubmitClick);
document.addEventListener('keydown', onArrowsKeyDown);
input.addEventListener('keydown', onEnterKeyDown);
document.addEventListener('touchstart', onTouchStart)
document.addEventListener('touchmove', onTouchMove)
document.addEventListener('touchend', onTouchEnd)
