//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//game state
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let lives = 3;
let level = 1;

//player
let playerWidth = 80;
let playerHeight = 10;
let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: 10
};

//ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x: boardWidth / 2 - ballWidth / 2,
    y: boardHeight / 2 - ballHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: 3,
    velocityY: 2
};

//blocks
let blockArray = [];
let blockColumns = 8;
let blockRows = 3;
let blockWidth = 50;
let blockHeight = 10;
let blockCount = 0;

let blockX = 15;
let blockY = 45;

//powerups
let powerUps = [];

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    document.addEventListener("keydown", keyHandler);

    document.addEventListener("mousemove", function(e){
        let rect = board.getBoundingClientRect();
        player.x = e.clientX - rect.left - player.width/2;
    });

    createBlocks();
    requestAnimationFrame(update);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width,board.height);

    //TITLE SCREEN
    if (gameOver){
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.fillText("BREAKOUT", 160, 150);

        context.font = "18px Arial";
        context.fillText("Score: " + score, 200, 200);
        context.fillText("High Score: " + highScore, 170, 230);
        context.fillText("Press SPACE to Restart", 130, 280);
        return;
    }

    //UI
    context.fillStyle = "white";
    context.font = "16px Arial";
    context.fillText("Score: " + score, 10, 20);
    context.fillText("Lives: " + lives, 200, 20);
    context.fillText("Level: " + level, 380, 20);

    //player
    context.fillStyle = "skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    //ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //walls
    if (ball.y <= 0){
        ball.velocityY *= -1;
    }
    else if (ball.x <= 0 || ball.x + ball.width >= boardWidth){
        ball.velocityX *= -1;
    }
    else if (ball.y + ball.height >= boardHeight){
        lives--;
        if (lives <= 0){
            endGame();
        } else {
            resetBall();
        }
    }

    //paddle
    if (detectCollision(ball, player)){
        let collidePoint = ball.x + ball.width/2 - (player.x + player.width/2);
        collidePoint = collidePoint / (player.width/2);

        ball.velocityX = collidePoint * 5;
        ball.velocityY *= -1;
    }

    //blocks
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++){
        let block = blockArray[i];

        if (!block.break){
            if (detectCollision(ball, block)){
                block.break = true;
                score += 10;
                blockCount--;

                //powerup chance
                if (Math.random() < 0.2){
                    powerUps.push({
                        x: block.x,
                        y: block.y,
                        width: 10,
                        height: 10,
                        velocityY: 2
                    });
                }

                ball.velocityY *= -1;
            }

            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //powerups
    context.fillStyle = "yellow";
    for (let i = 0; i < powerUps.length; i++){
        let p = powerUps[i];
        p.y += p.velocityY;

        context.fillRect(p.x, p.y, p.width, p.height);

        if (detectCollision(p, player)){
            player.width += 20;
            powerUps.splice(i,1);
            i--;
        }
    }

    //win
    if (blockCount == 0){
        level++;
        blockRows++;
        ball.velocityX *= 1.2;
        ball.velocityY *= 1.2;
        createBlocks();
        resetBall();
    }
}

//end game (NO RELOAD)
function endGame(){
    gameOver = true;

    if (score > highScore){
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
}

//reset game
function resetGame(){
    score = 0;
    lives = 3;
    level = 1;
    blockRows = 3;
    player.width = 80;

    createBlocks();
    resetBall();

    gameOver = false;
}

//reset ball
function resetBall(){
    ball.x = boardWidth / 2 - 5;
    ball.y = boardHeight / 2 - 5;
    ball.velocityX = 3;
    ball.velocityY = 2;
}

//controls
function keyHandler(e){
    if (gameOver && e.code == "Space"){
        resetGame();
    }

    if (e.code == "ArrowLeft"){
        player.x -= player.velocityX;
    }
    else if (e.code == "ArrowRight"){
        player.x += player.velocityX;
    }
}

//collision
function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

//blocks
function createBlocks(){
    blockArray = [];

    for (let c = 0; c < blockColumns; c++){
        for (let r = 0; r < blockRows; r++){
            blockArray.push({
                x: blockX + c * (blockWidth + 10),
                y: blockY + r * (blockHeight + 10),
                width: blockWidth,
                height: blockHeight,
                break: false
            });
        }
    }

    blockCount = blockArray.length;
}