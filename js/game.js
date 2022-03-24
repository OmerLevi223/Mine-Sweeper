'use strict'

const MINE = '💣';
const FLAG = '🚩';
// const EMPTY = '';

var gBoard;
var gBeforeFirstClick = true;
var gInterval;
var gElTimer = document.querySelector('.timer')
var gMinesremain;

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    gBoard = buildBoard();
    gBeforeFirstClick = true;
    gGame.isOn = true;
    gGame.secsPassed = 0;
    gMinesremain = gLevel.MINES;
    gElTimer.innerHTML = 0;
    renderBoard(gBoard);
}

function resetGame(){

}

function setLevel(num) {
    gLevel.SIZE = num;
    if (num === 4) gLevel.MINES = 2
    else if (num === 8) gLevel.MINES = 12
    else gLevel.MINES = 30
    clearInterval(gInterval)
    initGame();
}

function buildBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
        }
    }
    return board
}

function makeMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var emptyLocationArr = getEmptyLocations(gBoard);
        var randomLocation = getRandomEmptyLocation(emptyLocationArr);
        gBoard[randomLocation.i][randomLocation.j].isMine = true;
    }
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].minesAroundCount = countNeighbors(i, j, gBoard);
        }
    }
}

function cellClicked(i, j) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j];
    if (gBeforeFirstClick) {
        // gInterval = setInterval(startTimer, 10);
        startTimer();
        makeMines();
        setMinesNegsCount();
        gBeforeFirstClick = false;
    }

    cell.isShown = true;
    expandShown(gBoard, i, j)
    checkGameOver(i, j)
    renderBoard(gBoard);
}

function cellMarked(event, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return;
    if (event.which === 3) {
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
        if (gBeforeFirstClick) {
            startTimer();
            // gInterval = setInterval(startTimer, 10);
        }
        checkWinGame()
        gMinesremain--
        renderBoard(gBoard)
    }
}

function checkGameOver(i, j) {
    var cell = gBoard[i][j];
    if (cell.isMine) lostGame()
    else checkWinGame()
}


function checkWinGame() {
    var flagMinesCounter = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) return;
            if (gBoard[i][j].isMine && gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
                flagMinesCounter++
            }
        }
    }
    if (flagMinesCounter === gLevel.MINES) {
        gGame.isOn = false;
        clearInterval(gInterval)
    }
}

function checkWinGame() {
    if (gGame.shownCount + gGame.markedCount === gBoard.length **2) {
        gGame.isOn = false;
        clearInterval(gInterval)
    }
}



function lostGame() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
            }
        }
    }
    gGame.isOn = false;
    clearInterval(gInterval)
}

function expandShown(board, cellI, cellJ) {
    var cell = board[cellI][cellJ];
    if (cell.isMarked) return;
    if(!cell.minesAroundCount) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                var neighborCell = board[i][j];
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= board[i].length) continue;
                neighborCell.isShown = true;
            }
        }
    }
}


function startTimer(){
    gInterval = setInterval(timer, 10);
}

function timer() {
    gGame.secsPassed += (1 / 100);
    gElTimer.innerText = gGame.secsPassed.toFixed(2)
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = cell.isShown ? 'cell shown' : cell.isMarked ? 'cell marked' : 'cell hidden';
            // var className = cell.isShown ? 'cell shown' : 'cell hidden' ;
            strHTML += `<td data-i="${i}" data-j="${j}" onclick="cellClicked(${i}, ${j})"
             onmousedown="cellMarked(event, ${i}, ${j})" class="${className}" oncontextmenu="return false;">`;
            strHTML += cell.isMarked ? `<span class="flag">${FLAG}</span>` : cell.isMine ? MINE : cell.minesAroundCount ? `${cell.minesAroundCount}` : '';
            // strHTML += cell.isMine ? MINE : cell.minesAroundCount ? `${cell.minesAroundCount}` : '';
            strHTML += ' </td>'
        }
        strHTML += '</tr>';
    }
    
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

    var elMinesremain = document.querySelector('.mines span');
    elMinesremain.innerHTML = gMinesremain
}



