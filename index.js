let direction = 'right';
let modal = document.getElementById('modal');
let score = document.getElementById('score');
let windowSize = window.innerWidth;

class Board {
    canvas;
    dimension;
    gridCount;
    context;

    constructor(canvasId, dimension, gridCount) {
        this.canvas = document.getElementById(canvasId);
        this.dimension = dimension;
        this.gridCount = gridCount;
        this.canvas.setAttribute('width', dimension + 1);
        this.canvas.setAttribute('height', dimension + 1);
        this.context = this.canvas.getContext("2d");
    }


    getCanvasDimension() {
        return this.dimension + 1;
    }

    getCellSize() {
        return this.dimension / this.gridCount;
    }

    drawBoard() {
        this.context.clearRect(0, 0, this.getCanvasDimension(), this.getCanvasDimension());
        for (let x = 0; x <= this.dimension; x += this.getCellSize()) {
            this.context.moveTo(0.5 + x, 0);
            this.context.lineTo(0.5 + x, this.dimension)
        }

        for (let x = 0; x <= this.dimension; x += this.getCellSize()) {
            this.context.moveTo(0, 0.5 + x);
            this.context.lineTo(this.dimension, 0.5 + x)
        }
    }

    drawSquare(x, y, color) {
        this.context.beginPath();
        this.context.rect(this.getCellSize() * x, this.getCellSize() * y, this.getCellSize(), this.getCellSize());
        this.context.fillStyle = color;
        this.context.fill();
        this.context.stroke();
        this.context.closePath();
    }

    drawPoint() {
        this.drawSquare(trophyDimentions.x, trophyDimentions.y, 'red');
    }

    drawSnake(snake) {
        this.drawBoard()
        this.drawPoint();
        let getHeadPart = snake.getHead();
        snake.snake.forEach(({ x, y }) => {
            if (getHeadPart.x === x && getHeadPart.y === y) {
                this.drawSquare(x, y, 'orange');
            } else {
                this.drawSquare(x, y, 'yellow');
            }
        })
    }
}

class Snake {
    snake;

    constructor(snake) {
        this.snake = snake;
    }

    getLength() {
        return this.snake.length;
    }

    getHead() {
        return this.snake[this.getLength() - 1];
    }

    getBody() {
        return this.snake.slice(0, -1);
    }

    isCollidingItself() {
        const result = this.getBody().find((item) => {
            return item.x == this.getHead().x && item.y == this.getHead().y;
        })
        return !!result;
    }

    setNewSnakeHead() {
        const snakeHead = this.getHead();
        return snakeHead.generateMovedPoint(direction);
    }

    isCollidingTo(point) {
        if (this.setNewSnakeHead().x === point.x && this.setNewSnakeHead().y === point.y) {
            return true;
        }
        else return false;
    }

    move(point) {
        let meetThePoint =  this.isCollidingTo(point)
        if(meetThePoint){
            this.snake.push(point);
            point.setNewPoint();
        }else{
            this.snake.push(this.setNewSnakeHead())
            this.snake.shift();
        }
    }
}


class Point {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    generateRandomPoint() {
        let xPoint = Math.floor(Math.random() * 9);
        let yPoint = Math.floor(Math.random() * 9);
        return {
            x: xPoint,
            y: yPoint
        };
    }

    setNewPoint() {
        let point = this.generateRandomPoint();
        let isPointExist = snake.snake.find((snakeItem) => {
            return snakeItem.x === point.x && snakeItem.y === point.y
        })
        if (!!isPointExist) {
            this.setNewPoint();
        } else {
            trophyDimentions = new Point(point.x, point.y);
        }
    }


    generateMovedPoint(direction) {
        if (direction === 'right') {
            return new Point((this.x + 1) % 10, this.y);
        }
        else if (direction === 'left') {
            if (this.x == 0) {
                return new Point(9, this.y)
            } else {
                return new Point((this.x - 1) % 10, this.y)
            }
        }
        else if (direction === 'down') {
            return new Point(this.x, (this.y + 1) % 10)
        }
        else if (direction === 'up') {
            if (this.y == 0) {
                return new Point(this.x, 9)
            } else {
                return new Point(this.x, (this.y - 1) % 10)
            }
        }
    }

}

function directionHandler(newdirection) {
    if (newdirection == 'up' && direction !== 'down') {
        direction = 'up';
    }
    else if (newdirection == 'right' && direction !== 'left') {
        direction = 'right';
    }
    else if (newdirection == 'down' && direction !== 'up') {
        direction = 'down';
    }
    else if (newdirection == 'left' && direction !== 'right') {
        direction = 'left';
    }
}

function handleDirection() {
    window.addEventListener('keydown', (e) => {
        console.log(e.key)
        let keyDirection = '';

        switch(e.key) {
            case "ArrowUp":
                keyDirection = 'up';
                console.log(keyDirection)
                break;
            case "ArrowDown":
                keyDirection = 'down';
                break;
            case "ArrowLeft":
                keyDirection = 'left';
                break;
            case "ArrowRight":
                keyDirection = 'right';
                break;
        }
        directionHandler(keyDirection);
    });
}





let snake = new Snake([
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(3, 0),
])

let board;
if(windowSize > 600){
    board = new Board('game-board', 500, 10);
}else{
    board = new Board('game-board', 300, 10);
}


let trophyDimentions = new Point(0, 0);

function moveRect() {
    modal.classList.add('hide')
    trophyDimentions.setNewPoint();
    handleDirection();

    let interValId = setInterval(() => {
        if (snake.isCollidingItself()) {
            clearInterval(interValId);
            modal.classList.remove('hide')
            score.innerHTML = snake.getLength() - 4;
            return;
        }
        snake.move(trophyDimentions)
        board.drawSnake(snake);
    }, 300)

}

function start() {
    snake = new Snake([
        new Point(0, 0),
        new Point(1, 0),
        new Point(2, 0),
        new Point(3, 0),
    ])
    direction = 'right';
    moveRect()
}

moveRect();
