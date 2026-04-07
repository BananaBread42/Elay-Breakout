//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
}