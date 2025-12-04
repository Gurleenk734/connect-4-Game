var player1 = "red"; //#EE6677
var player2 = "yellow"; //#18BC9C

var currentPlayer = player1;
var gameOver = false;
var board;
var currcol;

var rows = 6;
var cols = 7;
var connect = 4;

const dropSound = new Audio("audio/drop.wav");
 dropSound.volume = 0.17;




window.onload = function() {
  setGame();
};





function setGame() {
  board = [];
  currcol = [5, 5, 5, 5, 5, 5, 5];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push("");

      //html
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();

      tile.classList.add("tile");

      tile.addEventListener("click", setPiece);
      document.getElementById("board").append(tile);
    }
    board.push(row);
  }
}

let player1Score = 0;
let player2Score = 0;

function updateScore(player, points) {
    if (player === 1) {
        player1Score += points;
        document.getElementById("player1-score").textContent = player1Score;
    } else {
        player2Score += points;
        document.getElementById("player2-score").textContent = player2Score;
    }
}

function placeDisc(col) {
    let row = currcol[col];
    if (row < 0) return; // column full

    board[row][col] = currentPlayer;
    currcol[col]--;

    // Play drop sound
    dropSound.currentTime = 0; // rewind in case it's still playing
   
    dropSound.play();
    

    renderBoard();
    checkWin();
    switchPlayer();
}



function setPiece() {
  if (gameOver) {
    return;
  }
  //  // 🎵 Start background music on first move
  // if (bgMusic.paused) {
  //   bgMusic.play();
  // }
  let coords = this.id.split("-"); //"0-0" -> ["0","0"]
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  //find the lowest empty spot in the column
  r = currcol[c];
  if (r < 0) {
    return;
  }

  board[r][c] = currentPlayer;
  let tile = document.getElementById(r.toString() + "-" + c.toString());

  if (currentPlayer == player1) {
    tile.classList.add("red-piece");
    currentPlayer = player2;
  } else {
    tile.classList.add("yellow-piece");
    currentPlayer = player1;
  }
  r -= 1; //move up the row
  currcol[c] = r; //update the column

  // 🔊 Play drop sound here
  dropSound.currentTime = 0;
  dropSound.play();

  // Update turn panel
  const turnText = document.getElementById("turnText");
  if (currentPlayer == player1) {
    turnText.innerText = "Blue's Turn";
    turnText.className = "red-turn";
  } else {
    turnText.innerText = "Yellow's Turn";
    turnText.className = "yellow-turn";
  }

  checkWinner();
}



// currcol[c] keeps track of the lowest empty row index in each column.

// Example: At the start, all columns are empty → bottom row is index 5 (since rows are 0–5).

// currcol[c] = r - 1;
// Moves the pointer up one row for that column.

// Example: If column 2 just got filled at row 5, then currcol[2] = 4.
// Next piece in that column will go to row 4.

// Example Play

// Player 1 clicks anywhere in column 3 → piece goes to (5,3).
// currcol[3] = 4.

// Player 2 clicks anywhere in column 3 → piece goes to (4,3).
// currcol[3] = 3.

// This continues until the column is full (currcol[c] < 0).

function checkWinner() {
  //horizontally, vertically, diagonally

  //horizontally
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 3; c++) {
      if (board[r][c] != "") {
        if (
          board[r][c] == board[r][c + 1] &&
          board[r][c] == board[r][c + 2] &&
          board[r][c] == board[r][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }
  //vertically
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 3; r++) {
      if (board[r][c] != "") {
        if (
          board[r][c] == board[r + 1][c] &&
          board[r][c] == board[r + 2][c] &&
          board[r][c] == board[r + 3][c]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }
  //diagonally
  for (let r = 0; r < rows - 3; r++) {
    for (let c = 0; c < cols - 3; c++) {
      if (board[r][c] != "") {
        if (
          board[r][c] == board[r + 1][c + 1] &&
          board[r][c] == board[r + 2][c + 2] &&
          board[r][c] == board[r + 3][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }
  //anti-diagonally
  for (let r = 3; r < rows; r++) {
    for (let c = 0; c < cols - 3; c++) {
      if (board[r][c] != "") {
        if (
          board[r][c] == board[r - 1][c + 1] &&
          board[r][c] == board[r - 2][c + 2] &&
          board[r][c] == board[r - 3][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }
}

function setWinner(r, c) {
    let winner = document.getElementById("winner");
    let overlay = document.getElementById("overlay");

    if (board[r][c] == player1) {
        winner.innerText = "Blue Wins!";
        launchConfetti("red");
    } else {
        winner.innerText = "Yellow Wins!";
        launchConfetti("gold");
    }

    gameOver = true;
    overlay.style.display = "flex"; // show overlay with popup
}

// Restart button logic
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("restartBtn").addEventListener("click", restartGame);
});

function restartGame() {
    // Clear board
    document.getElementById("board").innerHTML = "";
    setGame(); // reset game setup

    // Hide overlay
    document.getElementById("overlay").style.display = "none";

    // Reset game state
    gameOver = false;
    currentPlayer = player1;
}

function launchConfetti() {
  const duration = 3 * 1000; // 3 seconds
  const end = Date.now() + duration;

  (function frame() {
    // basic confetti burst
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    // keep going until duration ends
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

