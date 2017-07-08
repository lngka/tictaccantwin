// listeners for x, o, reset buttons
document.getElementById('xButton').addEventListener("click", onX);
document.getElementById('oButton').addEventListener("click", onO);
document.getElementById('resetButton').addEventListener("click", onReset);
document.getElementById('retryButton').addEventListener("click", onRetry);

var rawNodes = document.getElementsByClassName('node');
Array.from(rawNodes).forEach(function(node){
  node.addEventListener("click", function(){
    onNode(this);
  });
});

function onX() {
  GAME.humanPlayer = GAME.maxPlayer;
  GAME.AIPlayer = GAME.minPlayer;
  onReset();
  STARTGAME();

}

function onO() {
  GAME.humanPlayer = GAME.minPlayer;
  GAME.AIPlayer = GAME.maxPlayer;
  onReset();
  STARTGAME();

}

function onReset(){
  // reset GAME
  GAME = {
    board: [[null, null, null],
            [null, null, null],
            [null, null, null]],
    isOver: checkGameOver,
    lostCount: GAME.lostCount,
    drawCount: GAME.drawCount,
    maxPlayerSymbol: "X",
    minPlayerSymbol: "O",
    maxPlayer: true,
    minPlayer: false,
    AIPlayer: GAME.AIPlayer,        // keep current configuration
    humanPlayer: GAME.humanPlayer,  // keep current configuration
    currentTurn: GAME.maxPlayer
  };

  // reset graphics
  deannounce();
  let rawNodes = document.getElementsByClassName('node');
  Array.from(rawNodes).forEach(function(node){
    node.classList.remove(GAME.maxPlayerSymbol);
    node.classList.remove(GAME.minPlayerSymbol);
  });
}

function onNode(node) {
  // sanity check, if it's noone's turn then return immediately
  if (GAME.currentTurn == null)
     return;

  if (GAME.currentTurn === GAME.humanPlayer) {
    // allow human to make move if its his turn
    var row = node.id.split("")[1];
    var col = node.id.split("")[3];
    humanMove(row, col);
  }
}

/*
* similar to onReset but without modal dialog
* human can not chose new symbol with this function
* game will also start immediately
*/
function onRetry(){
  // reset GAME
  GAME = {
    board: [[null, null, null],
            [null, null, null],
            [null, null, null]],
    isOver: checkGameOver,
    lostCount: GAME.lostCount,
    drawCount: GAME.drawCount,
    maxPlayerSymbol: "X",
    minPlayerSymbol: "O",
    maxPlayer: true,
    minPlayer: false,
    AIPlayer: GAME.AIPlayer,        // keep current configuration
    humanPlayer: GAME.humanPlayer,  // keep current configuration
    currentTurn: GAME.maxPlayer
  };

  // reset graphics
  deannounce();
  let rawNodes = document.getElementsByClassName('node');
  Array.from(rawNodes).forEach(function(node){
    node.classList.remove(GAME.maxPlayerSymbol);
    node.classList.remove(GAME.minPlayerSymbol);
  });

  STARTGAME();
}

/*
* make annoucements
*/
function announce(string){
  var el = $("#annoucement");
  el.text("");
  el.text(string);
  el.css("opacity", "1")
}

function deannounce() {
  var el = $("#annoucement");
  el.css("opacity", "0");
}
