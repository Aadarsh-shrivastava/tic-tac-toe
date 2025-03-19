const boardElement = document.getElementById('board')
const restartButton = document.getElementById('reset')

const board = ['', '', '', '', '', '', '', '', '']

let xTurn = true;
let winner = null;

boardElement.addEventListener('click', function (event) {
    if (event.target.classList.contains("block")) {
        const blocks = Array.from(document.querySelectorAll(".block"))
        const index = blocks.indexOf(event.target)

        if (board[index] !== "" || winner !== null) return;

        board[index] = xTurn ? "X" : "O";
        event.target.textContent = board[index];

        if (checkWin(board[index])) {
            winner = board[index];
            setTimeout(() => alert(`${winner} wins!`), 100);
            return;
        }

        // Check for a draw
        if (!board.includes("")) {
            setTimeout(() => alert("It's a draw!"), 100);
            return;
        }

        xTurn = !xTurn
    }
})

restartButton.addEventListener('click', function () {
    restartGame();
})

function restartGame() {
    board.fill('');
    xTurn = true;
    winner = null;
    document.querySelectorAll('.block').forEach(block => {block.textContent = '';});
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
