//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//game stats
let score = 0;
let lives = 3;
let level = 1;

//player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
}

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
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3;
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

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    //mouse control
    document.addEventListener("mousemove", function(e){
        let rect = board.getBoundingClientRect();
        player.x = e.clientX - rect.left - player.width/2;
    });

    createBlocks();
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //draw UI
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

    //wall collisions
    if (ball.y <= 0) {
        ball.velocityY *= -1;
    }
    else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
        ball.velocityX *= -1;
    }
    else if (ball.y + ball.height >= boardHeight) {
        lives--;
        if (lives == 0) {
            alert("Game Over!");
            document.location.reload();
        } else {
            resetBall();
        }
    }

    //paddle collision
    if (detectCollision(ball, player)) {
        let collidePoint = ball.x + ball.width/2 - (player.x + player.width/2);
        collidePoint = collidePoint / (player.width/2);

        ball.velocityX = collidePoint * 5;
        ball.velocityY *= -1;
    }

    //blocks
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];

        if (!block.break) {
            if (detectCollision(ball, block)) {
                block.break = true;
                score += 10;
                blockCount--;

                //random powerup
                if (Math.random() < 0.2){
                    powerUps.push({
                        x: block.x,
                        y: block.y,
                        width: 10,
                        height: 10,
                        velocityY: 2
                    });
                }

                //bounce
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
            player.width += 20; //increase paddle
            powerUps.splice(i, 1);
            i--;
        }
    }

    //win condition
    if (blockCount == 0){
        level++;
        blockRows++;
        ball.velocityX *= 1.2;
        ball.velocityY *= 1.2;
        createBlocks();
        resetBall();
    }
}

//reset ball
function resetBall(){
    ball.x = boardWidth / 2 - ballWidth / 2;
    ball.y = boardHeight / 2 - ballHeight / 2;
    ball.velocityX = 3;
    ball.velocityY = 2;
}

//movement
function movePlayer(e) {
    if (e.code == "ArrowLeft") {
        let nextX = player.x - player.velocityX;
        if (!outOfBounds(nextX)) {
            player.x = nextX;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextX = player.x + player.velocityX;
        if (!outOfBounds(nextX)) {
            player.x = nextX;
        }
    }
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + player.width > boardWidth);
}

//collision
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

//blocks
function createBlocks() {
    blockArray = [];

    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: blockX + c * (blockWidth + 10),
                y: blockY + r * (blockHeight + 10),
                width: blockWidth,
                height: blockHeight,
                break: false
            };
            blockArray.push(block);
        }
    }

    blockCount = blockArray.length;
}