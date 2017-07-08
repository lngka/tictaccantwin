// listeners for x, o, reset buttons
document.getElementById('xButton').addEventListener("click", onX);
document.getElementById('oButton').addEventListener("click", onO);
document.getElementById('resetButton').addEventListener("click", onReset);

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
}

function onO() {
  GAME.humanPlayer = GAME.minPlayer;
  GAME.AIPlayer = GAME.maxPlayer;
  onReset();
}

function onReset(){
  // reset GAME
  GAME = {
    board: [[null, null, null],
            [null, null, null],
            [null, null, null]],
    isOver: checkGameOver,
    maxPlayerSymbol: "X",
    minPlayerSymbol: "O",
    maxPlayer: true,
    minPlayer: false,
    AIPlayer: GAME.AIPlayer,        // keep current configuration
    humanPlayer: GAME.humanPlayer,  // keep current configuration
    winner: null,
    currentTurn: GAME.maxPlayer
  };

  // reset graphics
  announce("");
  let rawNodes = document.getElementsByClassName('node');
  Array.from(rawNodes).forEach(function(node){
    node.classList.remove(GAME.maxPlayerSymbol);
    node.classList.remove(GAME.minPlayerSymbol);
  });

  STARTGAME();
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
