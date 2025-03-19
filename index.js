// dom elements
const boardElement = document.getElementById('board')
const restartButton = document.getElementById('restartButton')
const playAgainButton = document.getElementById('playAgainButton')
const closeAlertButton = document.getElementById('closeAlertButton')
const startButton = document.getElementById('startGameButton')

const board = ['', '', '', '', '', '', '', '', '']

let xTurn = true;
let winner = null;
let timeoutId;
let gameStarted = false;

// listeners
boardElement.addEventListener('click', function (event) {
    if(!gameStarted)
        return;

    if (event.target.classList.contains("block")) {
        const blocks = Array.from(document.querySelectorAll(".block"))
        const index = blocks.indexOf(event.target)

        if (board[index] !== "" || winner !== null) return;

        board[index] = xTurn ? "X" : "O";
        event.target.textContent = board[index];

        if (checkWin(board[index])) {
            winner = board[index];
            setTimeout(() => showAlert(`${winner} wins!`), 100);
            return;
        }

        // Check for a draw
        if (!board.includes("")) {
            setTimeout(() => showAlert("It's a draw!"), 100);
            return;
        }

        xTurn = !xTurn
        resetInactivity();
    }
})

restartButton.addEventListener('click', function () {
    restartGame();
})

closeAlertButton.addEventListener('click', function (event) { closeAlert() })

playAgainButton.addEventListener('click', function (event) { closeAlert(); restartGame() })

startButton.addEventListener('click',function(event){
    gameStarted=true
    resetInactivity();
    startButton.style.boxShadow='none';
})

// functions
function restartGame() {
    board.fill('');
    xTurn = true;
    winner = null;
    clearTimeout(timeoutId)
    timeoutId = null;
    gameStarted=false
    startButton.style.boxShadow='6px 6px 10px #0003'
    document.querySelectorAll('.block').forEach(block => {block.textContent = '';});
}

function resetInactivity() {
    clearTimeout(timeoutId);

    if (!gameStarted || winner !== null) return;

    timeoutId = setTimeout(() => {
        if(winner!==null)return ;

        winner = xTurn ? "O" : "X";
        showAlert(`${winner} wins by timeout!`);
    }, 15000);
}

function checkWin(turn) {

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winPatterns.some(pattern =>
        pattern.every(index =>
            board[index] === turn)
    )

}


function showAlert(message) {
    document.getElementById("alertMessage").innerText = message;
    document.getElementById("customAlert").classList.add("show");
}

function closeAlert() {
    document.getElementById("customAlert").classList.remove("show");
}

