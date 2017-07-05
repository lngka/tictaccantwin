// global variables
var gameStates = {
  playerSymbol: "O",
  compSymbol: "X",
  win: "Impossible",
  lose: 0,
  tie: 0,
  turn: "player",
  firstTurn: "player",
  randomMode: true
};
var boardStates = {A:"#", B:"#", C:"#", D:"#", E:"#", F:"#", G:"#", H:"#", I:"#"};
var boardLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
// var boardStates = ["#", "#", "#", "#", "#", "#", "#", "#", "#"];
var winningConditions = [["A", "E", "I"], ["C", "E", "G"],
                         ["B", "E", "H"], ["D", "E", "F"],
                         ["A", "D", "G"], ["A", "B", "C"],
                         ["C", "F", "I"], ["G", "H", "I"]
];
var compNodes = [];
var playerNodes = [];

// listeners for x, o, reset buttons
document.getElementById('xButton').addEventListener("click", onX);
document.getElementById('oButton').addEventListener("click", onO);
document.getElementById('resetButton').addEventListener("click", onReset);
// listeners for each node on the board
var rawNodes = document.getElementsByClassName('node');
Array.from(rawNodes).forEach(function(node){
  node.addEventListener("click", function(){
    onNode(this);
  });
});

STARTGAME();

// call backs
function onX() {
  onReset();
  gameStates.playerSymbol = "X";
  gameStates.compSymbol = "O";
}

function onO() {
  onReset();
  gameStates.playerSymbol = "O";
  gameStates.compSymbol = "X";
}

function onNode(node){
  if (gameStates.turn==="player") {
    if (boardStates[node.id]==="#") {
      // draw player symbol
      node.classList.add(gameStates.playerSymbol);
      // remember player's node
      boardStates[node.id] = gameStates.playerSymbol;
      playerNodes.push(node.id);
      // check if win
      var winResult = checkWinningConditions(playerNodes);
      console.log(winResult);
      if (winResult === "win") {
        announce("Player won");
        gameStates.turn = "none";
        return;
      }
      if (winResult === "tie") {
        announce("Tie game");
        gameStates.turn = "none";
        return;
      }
      if (winResult === "keep_playing") {
        gameStates.turn = "comp";
      }
    }
  }
}

function onReset(){
  // remove all markings
  announce("");
  Array.from(rawNodes).forEach(function(node){
    node.classList.remove("X");
    node.classList.remove("O");
  });

  // reset all data
  boardStates = {A:"#", B:"#", C:"#", D:"#", E:"#", F:"#", G:"#", H:"#", I:"#"};
  // boardStates = ["#", "#", "#", "#", "#", "#", "#", "#", "#"];
  compNodes = [];
  playerNodes = [];
  gameStates = {
    playerSymbol: "O",
    compSymbol: "X",
    win: "Impossible",
    lose: 0,
    tie: 0,
    turn: "player",
    firstTurn: "player",
    randomMode: true
  };
}

function STARTGAME(){
  switch (gameStates.turn) {
    case "player":
      playerMove();
      break;
    case "comp":
      compMove();
  }
}

function playerMove(){
  var waitForMove = setInterval(function(){
    if (gameStates.turn === "comp") {
      compMove();
      clearInterval(waitForMove);
    }
  }, 2000);
}

function compMove(){
  // random AI, very stupid
  if (gameStates.randomMode) {
    while (gameStates.turn === "comp") {
      // pick a random node
      var randomNum = (Math.random()*8).toFixed();
      var label = boardLabels[randomNum];

      // claim if free
      if (boardStates[label]==="#") {
        // draw comp's symbol
        var node = document.getElementById(label);
        node.classList.add(gameStates.compSymbol);
        boardStates[label] = gameStates.compSymbol;
        //remember computer's moves
        compNodes.push(label);
        // give turn to human player, thus end the while loop
        gameStates.turn = "player";
      }
    }
    // check if comp has won
    var winResult = checkWinningConditions(compNodes);
    console.log(winResult);
    if (winResult === "win") {
      announce("AI won");
      gameStates.turn = "none";
      return;
    }
    if (winResult === "tie") {
      announce("Tie game");
      gameStates.turn = "none";
      return;
    }
    if (winResult === "keep_playing") {
      playerMove();
    }
  }
      // TODO: master AI
}

function checkWinningConditions(nodesArray){
  var win = false;

  // set win to true if match a condition
  winningConditions.forEach(function(condition){
    var isMatched = condition.every(function(element){
      return nodesArray.includes(element);
    });
    if (isMatched)
      win = true;
  });

  // if there's a winner
  if (win)
    return "win";
  else {
    //check if board still has empty node(s)
    var emptyNodes = false;
    boardLabels.forEach(function(label){
      if (boardStates[label] === "#")
        emptyNodes = true;
    });
    // no win and no empty nodes left
    if (!emptyNodes) {
      return "tie";
    }
    else {
      return "keep_playing";
    }
  }
}

function announce(string){
  document.getElementById("annoucement").innerHTML = string;
}
