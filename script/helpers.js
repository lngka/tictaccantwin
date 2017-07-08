var GAME = {
  board: [[null, null, null],
          [null, null, null],
          [null, null, null]],
  isOver: checkGameOver,
  maxPlayerSymbol: "X",
  minPlayerSymbol: "O",
  maxPlayer: true,
  minPlayer: false,
  AIPlayer: null,    // either minPlayer or maxPlayer
  humanPlayer: null, // either minPlayer or maxPlayer
  winner: null,
  currentTurn: null // true(maxPlayer) or false(minPlayer)
};

/*
* check board for winning pattern
* return format [true, winner] or [false, null]
*/
function checkWin(board) {
  const ROWS = 3;
  const COLS = 3;

  // diagonal checks
  if ((board[0][0] != null) && (board[0][0] == board[1][1]) && (board[0][0] == board[2][2])) {
    var winner = board[0][0];
    return [true, winner];
  }
  if ((board[0][2] != null) && (board[0][2] == board[1][1]) && (board[0][2] == board[2][0])) {
    var winner = board[0][2];
    return [true, winner];
  }

  // horizontal checks
  for (var row = 0; row < ROWS; row++) {
    if ((board[row][0] != null) && (board[row][0] == board[row][1])  && (board[row][0] == board[row][2])) {
      var winner = board[row][0];
      return [true, winner];
    }
  }

  // vertical checks
  for (var col = 0; col < COLS; col++) {
    if ((board[0][col] != null) && (board[0][col] == board[1][col])  && (board[0][col] == board[2][col])) {
      var winner = board[0][col];
      return [true, winner];
    }
  }

  // default to no win
  return [false, null];
}

/*
* check if the board is terminal
*/
function checkGameOver(board) {
  // over if there is a winner
  if (checkWin(board)[0]) {
    return true;
  }

  // ok, no winner but if a null (empty) cell exists
  // then the game is not over
  const ROWS = 3;
  const COLS = 3;
  for (var row = 0; row < ROWS; row++) {
    for (var col = 0; col < COLS; col++)
      if (board[row][col] == null)
        return false;
  }

  // in case no winner AND no empty cell (tie)
  return true;
}

/*
* evaluate score from board state,
* from perspective of X - the first player
*/
function evaluate(board, depth) {
  // base score for winning
  // award to the maxPlayer
  const WINNING_SCORE = 100;

  // on going game evaluate to 0 score
  if (!GAME.isOver(board)) {
    return 0;
  }

  // if tie game evaluate to 0 score
  var winner = checkWin(board)[1];
  if (winner === null) {
    return 0;
  }

  // if winner is maxPlayer
  if (winner == GAME.maxPlayer) {
    return WINNING_SCORE - depth;
  }

  // if winner is minPlayer
  if (winner == GAME.minPlayer) {
    return  depth - WINNING_SCORE;
  }
}

/*
* find empty cells
*/
function findEmptyCells(board) {
  const ROWS = 3;
  const COLS = 3;
  var emptyCells = [];
  for (var row = 0; row < ROWS; row++) {
    for (var col = 0; col < COLS; col++) {
      if (board[row][col] === null) {
        emptyCells.push([row, col]);
      }
    }
  }
  return emptyCells;
}

/*
* find best move
* @parameter player is the AIPlayer
*/
function recurseMinimax(board, player, depth) {
  depth++;
  var possibleScores = [];
  var possibleMoves = [];
  var emptyCells = findEmptyCells(board);

  // if game is over
  if (checkGameOver(board)) {
    let move = null; //because the previous move ended the game
    let score = evaluate(board, depth);
    return [move, score];
  }

  // else similuate game further
  emptyCells.forEach(function(cell){
    // simulate: someone claims an empty cell
    let cellRow = cell[0];
    let cellCol = cell[1];
    board[cellRow][cellCol] = player;

    // simulate: opponent of someone claims the next empty cell
    let score = recurseMinimax(board, !player, depth)[1];

    // remember the end score for this empty cell
    possibleScores.push(score);
    possibleMoves.push(cell);

    // reverse change for next call
    board[cellRow][cellCol] = null;
  });

  // return the biggest score for maxPlayer
  if (player == GAME.maxPlayer) {
    let biggestScore = Math.max.apply(null, possibleScores);
    let index = possibleScores.indexOf(biggestScore);
    let move = possibleMoves[index];
    return [move, biggestScore];
  }

  // return the smallest score for minPlayer
  if (player == GAME.minPlayer) {
    let smallestScore = Math.min.apply(null, possibleScores);
    let index = possibleScores.indexOf(smallestScore);
    let move = possibleMoves[index];
    return [move, smallestScore];
  }
}



/*
* user controls
*/

function announce(string){
  document.getElementById("annoucement").innerHTML = string;
}
