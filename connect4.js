"use strict";

const PLAYER_RED = "R";
const PLAYER_YELLOW = "Y";
const ROWS = 6;
const COLUMNS = 7;

let currPlayer = PLAYER_RED;
let gameOver = false;
let board = [];
let currColumns = []; // next open row for each column, -1 when full

const boardEl = document.getElementById("board");
const winnerEl = document.getElementById("winner");
const turnIndicatorEl = document.getElementById("turn-indicator");
const turnDiscEl = document.getElementById("turn-disc");
const turnTextEl = document.getElementById("turn-text");
const resetButtonEl = document.getElementById("reset-button");

window.addEventListener("DOMContentLoaded", setGame);
resetButtonEl.addEventListener("click", setGame);

function setGame() {
    board = [];
    currColumns = new Array(COLUMNS).fill(ROWS - 1);
    currPlayer = PLAYER_RED;
    gameOver = false;

    boardEl.innerHTML = "";
    winnerEl.textContent = "";
    winnerEl.classList.remove("show");
    turnIndicatorEl.classList.remove("hidden");

    for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLUMNS; c++) {
            row.push(" ");

            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            tile.setAttribute("role", "gridcell");
            tile.setAttribute("tabindex", "0");
            tile.setAttribute("aria-label", `Row ${r + 1}, Column ${c + 1}`);
            tile.dataset.col = c;
            tile.addEventListener("click", () => dropPiece(c));
            tile.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    dropPiece(c);
                }
            });
            boardEl.append(tile);
        }
        board.push(row);
    }

    updateTurnIndicator();
}

function dropPiece(c) {
    if (gameOver) {
        return;
    }

    const r = currColumns[c];
    if (r < 0) {
        return; // column full
    }

    board[r][c] = currPlayer;
    const tile = document.getElementById(`${r}-${c}`);
    tile.classList.add(currPlayer === PLAYER_RED ? "red-piece" : "yellow-piece");

    currColumns[c] = r - 1;

    const winningCells = checkWinner();
    if (winningCells) {
        setWinner(winningCells);
        return;
    }

    if (isBoardFull()) {
        setDraw();
        return;
    }

    currPlayer = currPlayer === PLAYER_RED ? PLAYER_YELLOW : PLAYER_RED;
    updateTurnIndicator();
}

function isBoardFull() {
    return currColumns.every((row) => row < 0);
}

function updateTurnIndicator() {
    const isRed = currPlayer === PLAYER_RED;
    turnDiscEl.classList.toggle("yellow", !isRed);
    turnTextEl.textContent = isRed ? "Red's Turn" : "Yellow's Turn";
}

// Returns an array of the four winning [r, c] cells, or null if no winner yet.
function checkWinner() {
    const directions = [
        [0, 1],  // horizontal
        [1, 0],  // vertical
        [1, 1],  // diagonal (\)
        [1, -1], // diagonal (/)
    ];

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLUMNS; c++) {
            const piece = board[r][c];
            if (piece === " ") {
                continue;
            }

            for (const [dr, dc] of directions) {
                const cells = [[r, c]];
                for (let step = 1; step < 4; step++) {
                    const nr = r + dr * step;
                    const nc = c + dc * step;
                    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLUMNS || board[nr][nc] !== piece) {
                        break;
                    }
                    cells.push([nr, nc]);
                }
                if (cells.length === 4) {
                    return cells;
                }
            }
        }
    }

    return null;
}

function setWinner(cells) {
    const [r, c] = cells[0];
    const winnerName = board[r][c] === PLAYER_RED ? "Red" : "Yellow";

    winnerEl.textContent = `🎉 ${winnerName} Wins!`;
    winnerEl.classList.add("show");
    turnIndicatorEl.classList.add("hidden");
    gameOver = true;

    for (const [wr, wc] of cells) {
        document.getElementById(`${wr}-${wc}`).classList.add("winning-piece");
    }
}

function setDraw() {
    winnerEl.textContent = "🤝 It's a Draw!";
    winnerEl.classList.add("show");
    turnIndicatorEl.classList.add("hidden");
    gameOver = true;
}
