// dom elements
const boardElement = document.getElementById("board");
const restartButton = document.getElementById("restartButton");
const playAgainButton = document.getElementById("playAgainButton");
const closeAlertButton = document.getElementById("closeAlertButton");
const startButton = document.getElementById("startGameButton");
const timerElement1 = document.getElementById("timer1");
const timerElement2 = document.getElementById("timer2");
const timeBar1 = document.getElementById("profile-time-bar-1");
const timeBar2 = document.getElementById("profile-time-bar-2");

const board = ["", "", "", "", "", "", "", "", ""];

let xTurn = true;
let winner = null;
let gameStarted = false;
let countdown;
let timeLeft = 15;

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

restartButton.addEventListener("click", function () {
  restartGame();
});

closeAlertButton.addEventListener("click", function (event) {
  closeAlert();
});

playAgainButton.addEventListener("click", function (event) {
  closeAlert();
  restartGame();
});

startButton.addEventListener("click", function (event) {
  gameStarted = true;
  resetInactivity();
  startButton.style.boxShadow = "none";
});

// functions
function restartGame() {
  board.fill("");
  xTurn = true;
  winner = null;
  gameStarted = false;

  // timers reset
  clearInterval(countdown);
  timeLeft = 15;
  updateTimer();

  // ui update
  startButton.style.boxShadow = "6px 6px 10px #0003";
  timeBar1.style.width = '0px';
  timeBar2.style.width = '0px';
  
  document.querySelectorAll(".block").forEach((block) => {
    block.textContent = "";
  });
}

function updateTimer() {
  let percentage = (timeLeft / 15) * 100;
  if (xTurn) {
    timerElement1.textContent = `Time left: ${timeLeft}s`;
    timeBar1.style.width = `${percentage}%`;
  } else {
    timerElement2.textContent = `Time left: ${timeLeft}s`;
    timeBar2.style.width = `${percentage}%`;
  }
}

function resetInactivity() {
  clearInterval(countdown);

  if (!gameStarted || winner !== null) return;

  timeLeft = 15;
  updateTimer();

  countdown = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(countdown);
      if (winner !== null) return;

      winner = xTurn ? "O" : "X";
      showAlert(`${winner} wins by timeout!`);
    }
  }, 1000);

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
