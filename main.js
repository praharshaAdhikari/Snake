import {inputDirection, resetDirection} from "./mover.js"

let title = document.getElementById("titleEl")
let play = document.getElementById("playEl")
let rectangle = document.getElementById("rectangleEl")
let gameOverPanel = document.getElementById("gameOverPanelEl")
let main = document.getElementById("mainEl")
let gameOver = false
let touchedFood = false

export let snake_attri = {
    body: [{x:21, y:11}],
    score: 0,
}

function start(){
    title.id = "titleSmall"
    play.className = "hide"
    rectangle.style.display = "grid"
    main_loop()
}
 
function restart(){
    gameOverPanel.style.display = "none"
    main.style.display = "flex"
    title.id = "titleSmall"
    rectangle.style.display = "grid"
    gameOver = false
    snake_attri = {
        body: [{x:21, y:11}],
        score: 0,
    }
    resetDirection()
    main_loop()
}

play.onclick = start
let iDirection = {x:0, y:0}
let prevRender = 0
let speed = 5 // Updates 5 times per second

function main_loop(currentTime){
    if (gameOver) return
    window.requestAnimationFrame(main_loop)
    let timeAfterLastRender = (currentTime - prevRender) / 1000
    if (timeAfterLastRender < 1/ speed) return
    
    rectangle.innerHTML = ""
    iDirection = inputDirection()
    drawSnake(rectangle)
    update()
    gameOver_check()
    prevRender = currentTime
    drawFood(rectangle)
    if (snake_attri.body[0].x == food_pos.x && snake_attri.body[0].y == food_pos.y) eaten()
    showScore()
}

function update(){
    for (let i = snake_attri.body.length - 2; i>=0; i--) snake_attri.body[i+1] = { ...snake_attri.body[i] }
    snake_attri.body[0].x += iDirection.x
    snake_attri.body[0].y += iDirection.y
}

function drawSnake(rectangle){
    for(let i=0; i<snake_attri.body.length; i++){
        let snake = document.createElement("div")
        snake.style.gridRowStart = snake_attri.body[i].y
        snake.style.gridColumnStart = snake_attri.body[i].x
        snake.classList.add("snake")
        rectangle.appendChild(snake)
        if (i==0){
            drawEyes(snake, iDirection)
        }
    }
}

let food_pos = {x:Math.floor(Math.random()*42 + 1), y:Math.floor(Math.random()*21 + 1)}
function drawFood(rectangle){
    let food = document.createElement("div")
    if (touchedFood){
        food_pos = {x:Math.floor(Math.random()*42 + 1), y:Math.floor(Math.random()*21 + 1)}
        touchedFood = false
    }
    food.style.gridRowStart = food_pos.y
    food.style.gridColumnStart = food_pos.x
    food.classList.add("food")
    rectangle.appendChild(food)
}

function drawEyes(snake, iDirection){
    let eyes = document.createElement("span")
    eyes.classList.add("eyes")
    snake.appendChild(eyes)
    eyes.innerText = ". ."
    if (iDirection.y == -1) {
        eyes.innerText = ". ."
        eyes.style.top = "-14px"
    }
    if (iDirection.y == 1) {
        eyes.innerText = ". ."
        eyes.style.top = "-8px"
    }
    if (iDirection.x == -1) {
        eyes.innerText = ":"
        eyes.style.top = "-7px"
        eyes.style.left = "2px"
    }
    if (iDirection.x == 1) {
        eyes.innerText = ":"
        eyes.style.top = "-7px"
        eyes.style.left = "10px"
    }
}

function eaten(){
    touchedFood = true
    snake_attri.score++
    if (iDirection.y == -1) {
        snake_attri.body[snake_attri.body.length] = {...snake_attri.body[snake_attri.body.length-1].x,  
                                                    ...snake_attri.body[snake_attri.body.length-1].y+1}
    }
    if (iDirection.y == 1) {
        snake_attri.body[snake_attri.body.length] = {...snake_attri.body[snake_attri.body.length-1].x,  
                                                    ...snake_attri.body[snake_attri.body.length-1].y-1}
    }
    if (iDirection.x == -1) {
        snake_attri.body[snake_attri.body.length] = {...snake_attri.body[snake_attri.body.length-1].x+1,  
                                                    ...snake_attri.body[snake_attri.body.length-1].y}
    }
    if (iDirection.x == 1) {
        snake_attri.body[snake_attri.body.length] = {...snake_attri.body[snake_attri.body.length-1].x-1,  
                                                    ...snake_attri.body[snake_attri.body.length-1].y}
    }
}

function gameOver_check(){
    for(let i=1; i<snake_attri.body.length-1; i++){
        if (snake_attri.body[0].x == snake_attri.body[i].x && snake_attri.body[0].y == snake_attri.body[i].y){
            gameOver = true
            console.log("over")
        }
    }
    if (snake_attri.body[0].x > 43) gameOver = true
    if (snake_attri.body[0].y > 22) gameOver = true
    if (snake_attri.body[0].x < 0) gameOver = true
    if (snake_attri.body[0].y < 0) gameOver = true

    if (gameOver){
        main.style.display = "none"
        gameOverPanel.style.display = "flex"
        gameOverPanel.innerText = "Game Over"
        let playAgain = document.createElement("button")
        playAgain.onclick = restart
        playAgain.classList.add("playAgainEl")
        playAgain.innerText = "PLAY AGAIN"
        gameOverPanel.appendChild(playAgain)
    }
}

function showScore(){
    let scoreText = document.getElementById("scoreEl")
    scoreText.innerText = "Score: " + snake_attri.score.toString()
    scoreText.classList.add("score")
}