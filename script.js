// Add event listeners for player selection
let playerSymbol = null;
let computerSymbol = null;
let currentSymbol = 'X'; // Track whose turn it is
let gameOver = false; // Track if the game is over
let x_score = 0;
let o_score = 0;
let winner = null;
let size = null; // Default grid size
let cells = []; // Store the cells for easy access

// listen for the selection of player symbol and grid size
document.getElementById('player-symbol').addEventListener('change', function (event) {
    playerSymbol = event.target.value;
    if (playerSymbol === 'X') {
        computerSymbol = 'O';
    } else {
        computerSymbol = 'X';
    }
})

document.getElementById('grid-size').addEventListener('change', function (event) {
    size = parseInt(event.target.value);
});

function createGrid(size) {
    cells = []; // Reset cells array!
    document.getElementById('player-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    const gameGrid = document.getElementById('game-grid'); 
    gameGrid.innerHTML = ''; // Clear previous grid!
    gameGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameGrid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let y = 0; y < size * size; y++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${y}`;
        gameGrid.appendChild(cell);
        cells.push(cell);
        cell.addEventListener('click', function () {
            cellClicked(cell);
        });
    }
}
function cellClicked(cell) {
    if (gameOver) return;
    if (cell.innerHTML !== '') return;
    if (currentSymbol !== playerSymbol) return; // Only allow player to play their turn
    cell.innerHTML = playerSymbol;
    if (checkWinner() && checkWinner()[0]) return;
    switchTurn();
}

document.getElementById('start-game').addEventListener('click', function () {
    if (!playerSymbol || !size) {
        alert('Please select both a symbol and a grid size.');
        return;
    } else {
        createGrid(size);
        currentSymbol = 'X';
        document.getElementById('turn-message').innerHTML = `Player ${currentSymbol}'s turn`;
        if (computerSymbol === currentSymbol) {
            setTimeout(computerMove, 500);
        }
    }
});
switchTurn();
function switchTurn() {
    if (currentSymbol === 'X') {
        currentSymbol = 'O';
    } else {
        currentSymbol = 'X';
    }
    document.getElementById('turn-message').innerHTML = `Player ${currentSymbol}'s turn`;
    if (!gameOver && currentSymbol === computerSymbol) {
        setTimeout(computerMove, 500);
        if (checkWinner()) {
            winMessage();
        }
    }
}

function computerMove() {
    if (gameOver) return;

    // 1. Try to win
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML === '') {
            cells[i].innerHTML = computerSymbol;
            if (checkWinner(computerSymbol)) {
                winMessage()
                return;
            }
            cells[i].innerHTML = '';
        }
    }

    // 2. Try to block the player
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML === '') {
            cells[i].innerHTML = playerSymbol;
            if (checkWinner(playerSymbol)) {
                cells[i].innerHTML = computerSymbol;
                // winner = null;
                gameOver = false;
                document.getElementById('message').style.display = 'none';
                switchTurn();
                return;
            }
            cells[i].innerHTML = '';
        }
    }
    // 3. Otherwise, pick a random empty cell
    let emptyCells = [];
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML === '') {
            emptyCells.push(i);
        }
    }
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        cells[randomCell].innerHTML = computerSymbol;
        // if (checkWinner() && checkWinner()[0]) return;
        switchTurn();
    }
    if (checkWinner()) {
        winMessage();
    }
}

function winMessage() {
    if (winner === 'X') {
        document.getElementById('message').innerHTML = "Player X wins!";
    } else if (winner === 'O') {
        document.getElementById('message').innerHTML = "Player O wins!";
    } else {
        document.getElementById('message').innerHTML = "It's a draw!";
    }
    gameOver = true;
    document.getElementById('message').style.display = 'block';
    updateScoreBoard();
}

function checkWinner(symbol) {
    // Check rows, columns, and diagonals for a winner dynamically based on grid size
    for (let i = 0; i < size; i++) {
        // Check rows
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(cells[i * size + j].innerHTML);
        }
        if (row.every(cell => cell === row[0] && cell !== '')) {
            winner = row[0];
            return true;
        }
        // Check columns
        let column = [];
        for (let j = 0; j < size; j++) {
            column.push(cells[j * size + i].innerHTML);
        }
        if (column.every(cell => cell === column[0] && cell !== '')) {
            winner = column[0];
            return true;
        }
        // Check diagonals
        let diagonal1 = [];
        for (let j = 0; j < size; j++) {
            diagonal1.push(cells[j * (size + 1)].innerHTML);
        }
        if (diagonal1.every(cell => cell === diagonal1[0] && cell !== '')) {
            winner = diagonal1[0];
            return true;
        }
        let diagonal2 = [];
        for (let j = 1; j < size + 1; j++) {
            diagonal2.push(cells[j * (size - 1)].innerHTML);
        }
        if (diagonal2.every(cell => cell === diagonal2[0] && cell !== '')) {
            winner = diagonal2[0];
            return true;
        }
        // Check for a draw
        let isDraw = true;
        for (let cell of cells) {
            if (cell.innerHTML === '') {
                isDraw = false;
                break;
            }
        }
        if (isDraw) {
            document.getElementById('message').innerHTML = "It's a draw!";
            document.getElementById('message').style.display = 'block';
            gameOver = true;
            return true; // No winner in case of a draw
        }
    }
    return false;
}
function updateScoreBoard() {
    if (gameOver && winner === 'X') {
        x_score++;
    }
    else if (gameOver && winner === 'O') {
        o_score++;
    }
    document.getElementById('x-score').innerHTML = `X- ${x_score}`;
    document.getElementById('o-score').innerHTML = `O- ${o_score}`;
}

//activate new game button
function newGame() {
for (let cell of cells) {
        cell.innerHTML = '';
    }
    gameOver = false;
    currentSymbol = 'X';
    document.getElementById('message').style.display = 'none';
    document.getElementById('turn-message').innerHTML = `Player ${currentSymbol}'s turn`;
    // If computer is X, let it play first after reset
    if (computerSymbol === 'X') {
        setTimeout(computerMove, 500);
    }
}
document.getElementById('reset-button').addEventListener('click', newGame);
