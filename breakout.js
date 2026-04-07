//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

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
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x: boardWidth / 2 - ballWidth / 2,
    y: boardHeight / 2 - ballHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3;
let blockCount = 0;

// starting block position
let blockX = 15;
let blockY = 45;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    createBlocks();
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // player
    context.fillStyle = "skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // wall collisions
    if (ball.y <= 0) {
        ball.velocityY *= -1;
    }
    else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
        ball.velocityX *= -1; // FIXED
    }
    else if (ball.y + ball.height >= boardHeight) {
        alert("Game Over");
        document.location.reload();
    }

    // paddle collision
    if (detectCollision(ball, player)) {
        let collidePoint = ball.x + ball.width / 2 - (player.x + player.width / 2);
        collidePoint = collidePoint / (player.width / 2);

        ball.velocityX = collidePoint * 5;
        ball.velocityY *= -1;
    }

    // blocks
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];

        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                ball.velocityY *= -1;
                block.break = true;
                blockCount--;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                ball.velocityX *= -1;
                block.break = true;
                blockCount--;
            }

            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }
}

// movement
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
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

// collision detection (FIXED)
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function topCollision(ball, block) {
    return detectCollision(ball, block) && ball.y + ball.height >= block.y;
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && block.y + block.height >= ball.y;
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && ball.x + ball.width >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && block.x + block.width >= ball.x;
}

// create blocks
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