import { randomIntFromInterval } from './utils.js'

let canvas = document.querySelector("canvas")
let c = canvas.getContext("2d")

let lastRenderTime = 0
let highScore = getHighScore()

document.querySelector("#high-score").innerHTML = "High Score: " + highScore
let inputDirection = { x: 20, y: 0 }
let grid = createGrid()
let snake = createSnake()
let food = { x: 0, y: 40 }
let dead = false


function main(currentTime) {

    window.requestAnimationFrame(main)
    let secondsSinceLastRender = (currentTime - lastRenderTime) / 1000

    if (secondsSinceLastRender < 1 / 2) return

    lastRenderTime = currentTime

    update()
    draw()

}

window.requestAnimationFrame(main)

function update() {

    if (collision()) {
        resetGame()
        return
    }

    if (snake[snake.length - 1].x == 500) {
        snake[snake.length - 1].x = 0
    }
    else if (snake[snake.length - 1].x == -20) {
        snake[snake.length - 1].x = 480
    }
    else if (snake[snake.length - 1].y == 500) {
        snake[snake.length - 1].y = 0
    }
    else if (snake[snake.length - 1].y == -20) {
        snake[snake.length - 1].y = 480
    }

    for (let i = 0; i < snake.length - 1; i++) {
        snake[i] = { ...snake[i + 1] }
    }

    if (snakeIsOnFood()) {
        food = createNewFood()
        makeSnakeLonger()
        updateScore()
    }

    if (dead) {
        inputDirection = { x: 20, y: 0 }
        dead = false
    }

    snake[snake.length - 1].x += inputDirection.x;
    snake[snake.length - 1].y += inputDirection.y;

}

function draw() {

    c.clearRect(0, 0, canvas.width, canvas.height)
    c.beginPath()
    c.rect(food.x, food.y, 20, 20)
    c.fillStyle = "#C5C6C7"
    c.fill()

    snake.forEach(segment => {
        c.beginPath()
        c.rect(segment.x, segment.y, 20, 20)
        c.fillStyle = "#45A29E"
        c.fill()
        c.lineWidth = 1
        c.strokeStyle = "black"
        c.stroke()
    })

}

function createGrid() {
    let grid = []
    for (let i = 0; i < 500; i += 20) {
        let y = i
        for (let j = 0; j < 500; j += 20) {
            let x = j
            grid.push({ x: x, y: y })
        }
    }
    return grid
}

function createSnake() {
    return [
        { x: 0, y: 0 },
        { x: 20, y: 0 },
        { x: 40, y: 0 },
        { x: 60, y: 0 },
        { x: 80, y: 0 },
        { x: 100, y: 0 },
        { x: 120, y: 0 },
        { x: 140, y: 0 },
        { x: 160, y: 0 }
    ]
}

function snakeIsOnFood() {
    return snake[snake.length - 1].x == food.x && snake[snake.length - 1].y == food.y
}

function makeSnakeLonger() {
    snake.unshift({ x: snake[0].x - 20, y: snake[0].y })
}

function createNewFood() {
    let availableGrid = grid.filter(g => !snake.some(s => s.x == g.x && s.y == g.y))
    return availableGrid[randomIntFromInterval(0, availableGrid.length - 1)]
}

function updateScore() {
    document.querySelector("#score").innerHTML = parseInt(document.querySelector("#score").innerHTML) + 20;
}

function resetGame() {
    updateHighScore()
    document.querySelector("#score").innerHTML = 0;
    snake = createSnake();
    dead = true
}

function getHighScore() {
    let value;
    if (localStorage.getItem("score")) {
        value = parseInt(localStorage.getItem("score"))
    }
    else {
        localStorage.setItem("score", 0)
        value = 0
    }
    document.querySelector("#high-score").innerHTML = "High Score:" + value
    return value
}

function updateHighScore() {
    let score = parseInt(document.querySelector("#score").innerHTML)
    let highScore = parseInt(localStorage.getItem("score"))

    if (score > highScore) {
        document.querySelector("#high-score").innerHTML = "High Score: " + score
        localStorage.setItem("score", score)
    }

}

function collision() {
    let snakeBody = [...snake]
    let snakeHead = [...snake][snake.length - 1]
    snakeBody.pop()
    return snakeBody.filter(sn => sn).some(s => s.x == snakeHead.x && s.y == snakeHead.y)
}

window.addEventListener('keydown', e => {

    switch (e.key) {
        case 'ArrowUp':
            if (inputDirection.y == 20) return
            inputDirection = { x: 0, y: -20 }
            break
        case 'ArrowDown':
            if (inputDirection.y == -20) return
            inputDirection = { x: 0, y: 20 }
            break
        case 'ArrowLeft':
            if (inputDirection.x == 20) return
            inputDirection = { x: -20, y: 0 }
            break
        case 'ArrowRight':
            if (inputDirection.x == -20) return
            inputDirection = { x: 20, y: 0 }
            break
    }
})

