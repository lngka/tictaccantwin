/*
* allow AI to plays at game start
*/

function STARTGAME(){
  // sanity check, if it's noone's turn then return immediately
  if (GAME.currentTurn == null)
     return;
  if (GAME.currentTurn == GAME.AIPlayer) {
    AIFirstMoves();
  }
}

/*
* AI calculate the best move and actually take the move
*/

function AIMoves() {
  // sanity check, if it's not AI turn, return immediately
  if (GAME.currentTurn != GAME.AIPlayer)
    return;

  //else proceed
  // calculating...
  var depth = 0;
  var board = GAME.board.slice();
  var player = GAME.AIPlayer;
  bestMove =  recurseMinimax(board, player, depth)[0];

  // claiming...
  var bestRow = bestMove[0];
  var bestCol = bestMove[1];
  GAME.board[bestRow][bestCol] = GAME.AIPlayer;

  // update graphic
  var node = document.getElementById("r"+bestRow+"c"+bestCol);
  if (GAME.AIPlayer == GAME.maxPlayer) {
    node.classList.add(GAME.maxPlayerSymbol);
  }
  if (GAME.AIPlayer == GAME.minPlayer) {
    node.classList.add(GAME.minPlayerSymbol);
  }

  // check if game end
  if (checkGameOver(GAME.board)) {
    GAME.currentTurn = "null";
    var winner = checkWin(GAME.board)[1];
    if (winner === GAME.AIPlayer)
      announce("You lost");
    else
      tieGame();
  } else {
    GAME.currentTurn = GAME.humanPlayer;
  }
}

/*
* AI varies its first move
*/
function AIFirstMoves() {
  // sanity check, if it's not AI turn, return immediately
  if (GAME.currentTurn != GAME.AIPlayer)
    return;

  // else roll a dice
  var possibleFirstMoves = [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]];
  var index;
  let diceRoll = (Math.random()*100).toFixed();
  if (diceRoll < 20)
    index = 0;
  else if (diceRoll < 40)
    index = 1;
  else if (diceRoll < 60)
    index = 2;
  else if (diceRoll < 80)
    index = 3;
  else if (diceRoll < 100)
    index = 4;

  // claiming...
  let firstMove = possibleFirstMoves[index];
  var row = firstMove[0];
  var col = firstMove[1];
  GAME.board[row][col] = GAME.AIPlayer;

  // update graphic
  var node = document.getElementById("r"+row+"c"+col);
  if (GAME.AIPlayer == GAME.maxPlayer) {
    node.classList.add(GAME.maxPlayerSymbol);
  }
  if (GAME.AIPlayer == GAME.minPlayer) {
    node.classList.add(GAME.minPlayerSymbol);
  }
  
  // let the human plays
  GAME.currentTurn = GAME.humanPlayer;
}

/*
* human makes move and hand over the turn
*/

function humanMove(row, col) {
  // if node is not empty, return immediately
  if (GAME.board[row][col] != null)
    return;

  // else proceed
  // claiming...
  GAME.board[row][col] = GAME.humanPlayer;

  // update graphic
  var node = document.getElementById("r"+row+"c"+col);
  if (GAME.humanPlayer == GAME.maxPlayer) {
    node.classList.add(GAME.maxPlayerSymbol);
  }
  if (GAME.humanPlayer == GAME.minPlayer) {
    node.classList.add(GAME.minPlayerSymbol);
  }

  // check if game ends
  if (checkGameOver(GAME.board)) {
    GAME.currentTurn = "null";
    var winner = checkWin(GAME.board)[1];
    // if there's a winner
    if (winner === GAME.humanPlayer)
      announce("You won...how??");
    else
      tieGame();
  } else { // game goes on
    GAME.currentTurn = GAME.AIPlayer;
    AIMoves();
  }
}

function tieGame(){
  announce("It's a draw");
}
