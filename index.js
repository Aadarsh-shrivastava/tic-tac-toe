// dom elements
const boardElement = document.getElementById("board");
const restartButton = document.getElementById("restartButton");
const playAgainButton = document.getElementById("playAgainButton");
const closeAlertButton = document.getElementById("closeAlertButton");
const startButton = document.getElementById("startGameButton");
const xTimeBar = document.querySelector("#profile-time-bar-x .border-rect");
const oTimeBar = document.querySelector("#profile-time-bar-o .border-rect");

const board = ["", "", "", "", "", "", "", "", ""];

let xTurn = true;
let winner = null;
let gameStarted = false;
let timeLeft = 15;
let timeoutId;

const xTotalLength = xTimeBar.getTotalLength(); // Gets actual stroke length dynamically
const oTotalLength = oTimeBar.getTotalLength();

xTimeBar.style.strokeDasharray = xTotalLength;
oTimeBar.style.strokeDasharray = oTotalLength;

// listeners
boardElement.addEventListener("click", function (event) {
  if (!gameStarted) return;

  if (event.target.classList.contains("block")) {
    const blocks = Array.from(document.querySelectorAll(".block"));
    const index = blocks.indexOf(event.target);

    if (board[index] !== "" || winner !== null) return;

    board[index] = xTurn ? "X" : "O";
    event.target.textContent = board[index];

    if (checkWin(board[index])) {
      winner = board[index];
      stopGame(`${winner} wins!`, winner);
      return;
    }

    // Check for a draw
    if (!board.includes("")) {
      stopGame(`its a Draw !`, null);
      return;
    }

    xTurn = !xTurn;
    resetInactivity();
  }
});

function stopGame(message, winner) {
  winner = winner;
  clearTimeout(timeoutId);
  resetTimers();
  setTimeout(() => showAlert(message), 500);
  gameStarted = false;
  startButton.style.boxShadow = "6px 6px 10px #0003";
}

closeAlertButton.addEventListener("click", function (event) {
  closeAlert();
});

playAgainButton.addEventListener("click", function (event) {
  closeAlert();
  restartGame();
  gameStarted = true;
  resetInactivity();
});

startButton.addEventListener("click", function (event) {
  if (gameStarted) return;
  gameStarted = true;
  restartGame();
  resetInactivity();
  startButton.style.boxShadow = "none";
});

// functions
function restartGame() {
  board.fill("");
  xTurn = true;
  winner = null;

  // timers reset
  clearTimeout(timeoutId);
  document.querySelectorAll(".block").forEach((block) => {
    block.textContent = "";
  });
}

function updateTimer() {
  setTimeout(() => {
    if (xTurn) {
      xTimeBar.style.animation = "timerAnimation 15s linear forwards";
    } else {
      oTimeBar.style.animation = "timerAnimation 15s linear forwards";
    }
  }, 10); // Small delay ensures browser processes animation removal
}

function resetTimers() {
  console.log("resetting");
  xTimeBar.style.animation = "none";
  oTimeBar.style.animation = "none";

  // Reset the stroke offset completely to prevent visual glitches
  xTimeBar.style.strokeDashoffset = xTotalLength;
  oTimeBar.style.strokeDashoffset = oTotalLength;
}
function resetInactivity() {
  clearTimeout(timeoutId);
  resetTimers();

  if (!gameStarted || winner !== null) return;

  updateTimer();

  timeoutId = setTimeout(() => {
    if (winner !== null) return;
    winner = xTurn ? "O" : "X";
    showAlert(`${winner} wins by timeout!`);
  }, 15000);
}

function checkWin(turn) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  return winPatterns.some((pattern) =>
    pattern.every((index) => board[index] === turn)
  );
}

function showAlert(message) {
  document.getElementById("alertMessage").innerText = message;
  document.getElementById("customAlert").classList.add("show");
}

function closeAlert() {
  document.getElementById("customAlert").classList.remove("show");
}
