// dom elements
const boardElement = document.getElementById("board");
const restartButton = document.getElementById("restartButton");
const playAgainButton = document.getElementById("playAgainButton");
const closeAlertButton = document.getElementById("closeAlertButton");
const startButton = document.getElementById("startGameButton");
const xtimer = document.getElementById("timer1");
const oTimer = document.getElementById("timer2");
const xTimeBar = document.querySelector("#profile-time-bar-x .border-rect");
const oTimeBar = document.querySelector("#profile-time-bar-o .border-rect");   

const board = ["", "", "", "", "", "", "", "", ""];

let xTurn = true;
let winner = null;
let gameStarted = false;
let countdown;
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
      clearTimeout(timeoutId)
      resetTimers()
      setTimeout(() => showAlert(`${winner} wins!`), 500);
      return;
    }

    // Check for a draw
    if (!board.includes("")) {
      setTimeout(() => showAlert("It's a draw!"), 500);
      return;
    }

    xTurn = !xTurn;
    resetInactivity();
  }
});

closeAlertButton.addEventListener("click", function (event) {
  closeAlert();
});

playAgainButton.addEventListener("click", function (event) {
  closeAlert();
  restartGame();
  gameStarted=true;
  resetInactivity()
});

startButton.addEventListener("click", function (event) {
  gameStarted = true;
  restartGame();
  resetInactivity();
});

// functions
function restartGame() {
  board.fill("");
  xTurn = true;
  winner = null;

  // timers reset
  clearTimeout(timeoutId);
  resetTimers();
  document.querySelectorAll(".block").forEach((block) => {
    block.textContent = "";
  });
}

function updateTimer(){

  let percentage = timeLeft / 15; // Normalize to 0 - 1
  
  if (xTurn) {
    xTimeBar.style.animation = "none";
    void xTimeBar.offsetWidth; // Force reflow (trick to restart animation)
    xTimeBar.style.animation = "timerAnimation 15s linear forwards";
  } else {
    oTimeBar.style.animation = "none";
    void oTimeBar.offsetWidth; // Force reflow (trick to restart animation)
    oTimeBar.style.animation = "timerAnimation 15s linear forwards";
  }
}

function resetTimers(){
  xTimeBar.style.strokeDashoffset='0';
  oTimeBar.style.strokeDashoffset='0';

  xTimeBar.style.animation = "none";
  oTimeBar.style.animation = "none";
}

function resetInactivity() {
  clearTimeout(timeoutId);
  resetTimers();

  if (!gameStarted || winner !== null) return;
  updateTimer();
  timeoutId = setTimeout(() => {
    if (winner !== null) return;
    resetTimers();
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
