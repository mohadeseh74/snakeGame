
const canvas = document.getElementById('game-board');
//grid width and height
const bw = 500;
const bh = 500;
//padding around grid
//size of canvas
var cw = bw + 1;
var ch = bh + 1;



const cellSize = 50;
let snake = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0]
]
let direction = 'right';
let appleDimentions = [0,0];

canvas.setAttribute('width', cw);
canvas.setAttribute('height', ch);
var context = canvas.getContext("2d");




function drawBoard() {

//     var background = new Image();
// background.src = "./grass.jpg";
// background.onload = function(){
//     context.drawImage(background,0,0, 400, 400);
// }
    context.clearRect(0, 0, cw, ch);
    for (var x = 0; x <= bw; x += cellSize) {
        context.moveTo(0.5 + x, 0);
        context.lineTo(0.5 + x, bh);
    }


    for (var x = 0; x <= bh; x += cellSize) {
        context.moveTo(0, 0.5 + x);
        context.lineTo(bw, 0.5 + x);
    }

    context.strokeStyle = "white";
    context.stroke();
}

drawBoard();


function generateRandomPoint() {
    let xPoint = Math.floor(Math.random() * 9);
    let yPoint = Math.floor(Math.random() * 9);
    const isPointExist = snake.find(([x, y]) => {
        return x == xPoint && y == yPoint
    })
    if (isPointExist) {
        generateRandomPoint()
    } else {
        appleDimentions = [xPoint, yPoint];
    }
}

function gameOver() {
    let lastIndex = snake.length - 1;

    console.log(lastIndex)
    let snakeHead = snake[lastIndex];
    let snakeBody = snake.slice(0, -1)
    const result = snakeBody.find(([x, y]) => {
        return x === snakeHead[0] && y === snakeHead[1]
    })

    return !!result;
}

function meetThePoint() {
    let leftPoint = appleDimentions[0] - 1;
    let rightPoint = appleDimentions[0] + 1;
    let topPoint = appleDimentions[1] - 1;
    let downPoint = appleDimentions[1] + 1;

    let lastIndex = snake.length - 1;
    let snakeHead = snake[lastIndex];

    if(direction === 'right' && snakeHead[0] === rightPoint && snakeHead[1] == appleDimentions[1] ) {
        snake.unshift(appleDimentions)
        generateRandomPoint()
    }
    if(direction === 'left' && snakeHead[0] === leftPoint && snakeHead[1] === appleDimentions[1] ) {
        snake.unshift(appleDimentions)
        generateRandomPoint()
    }
    if(direction === 'down' && snakeHead[1] === downPoint && snakeHead[0] === appleDimentions[0] ) {
        snake.unshift(appleDimentions)
        generateRandomPoint()
    }
    if(direction === 'up' && snakeHead[1] === topPoint && snakeHead[0] === appleDimentions[0] ) {
        snake.unshift(appleDimentions)
        generateRandomPoint()
    }
}

function snakeMove() {
    snake.shift();
    let lastIndex = snake.length - 1;
    let snakeHead = snake[lastIndex];
    if(direction === 'right'){
        snake.push([(snakeHead[0] + 1) % 10, snakeHead[1]])


    }
    else if(direction === 'left') {
        if (snakeHead[0] == 0) {
            snake.push([9, snakeHead[1]])
        } else {
            snake.push([(snakeHead[0] - 1) % 10, snakeHead[1]])
        }
    }
    else if(direction === 'down') {
        snake.push([snakeHead[0], (snakeHead[1] + 1) % 10])
    }
    else if(direction === 'up') {
        if (snakeHead[1] == 0) {
            snake.push([snakeHead[0], 9])
        } else {
            snake.push([snakeHead[0], (snakeHead[1] - 1) % 10])
        }
    }
}

function moveRect() {
    generateRandomPoint();
    gameOver();


    document.addEventListener('keydown', (e) => {
        if (e.key == 'ArrowUp' && direction !== 'down') {
            direction = 'up';
        }
        else if (e.key == 'ArrowRight' && direction !== 'left') {
            direction = 'right';
        }
        else if (e.key == 'ArrowDown' && direction !== 'up') {
            direction = 'down';
        }
        else if (e.key == 'ArrowLeft' && direction !== 'right') {
            direction = 'left';
        }
    });



    function drawSnake() {

        drawBoard();

        var background = new Image();
        background.src = "./apple.png";

        // generating point
        context.beginPath();
        // context.fillStyle = "red";
        context.drawImage(background,cellSize * appleDimentions[0], cellSize * appleDimentions[1], cellSize , cellSize)
        // context.fillRect(cellSize * appleDimentions[0], cellSize * appleDimentions[1], cellSize, cellSize);
        context.closePath();

        snake.forEach(([x, y]) => {
            context.beginPath();
            context.fillStyle = "black";
            // context.arc(cellSize * x, cellSize * y, 25, 0, 2 * Math.PI);
            // context.fill()

            context.fillRect(cellSize * x, cellSize * y, cellSize, cellSize);
            // context.clearRect();
            context.closePath();
        })
    }


    let interValId = setInterval(() => {
        if(gameOver()) {
            clearInterval(interValId);
            return;
        }

        meetThePoint();
        drawSnake();
        snakeMove();
    }, 200)
}

moveRect();
