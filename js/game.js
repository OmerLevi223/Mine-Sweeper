'use strict'

const MINE = '💣';
const FLAG = '🚩';
const WIN = '😎';
const LOSE = '😵';
const NORMAL = '😃';

var gBoard;
var gBeforeFirstClick = true;
var gInterval;
var gElTimer = document.querySelector('.timer');
var gMinesremain;
var gLivesRemain;
var gNieCellCounter;
var gVictory = true;
var gElRes = document.querySelector('.restart')
var gLeaderBords;
var gElLeaderBords;
var gHint = false;
var gOpenHint;
var gPlayersList=[];

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
    clearInterval(gInterval)
    gBeforeFirstClick = true;
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gMinesremain = gLevel.MINES;
    gGame.secsPassed = 0;
    gElTimer.innerHTML = 0;
    gLivesRemain = 3;
    gOpenHint = 3;
    gNieCellCounter = 0;
    gElRes.innerHTML = NORMAL;
    renderBoard(gBoard);
    var elgOpenHint = document.querySelector('.hint span');
    elgOpenHint.innerHTML = gOpenHint;
}

function setLevel(num) {
    gLevel.SIZE = num;
    if (num === 4) gLevel.MINES = 2
    else if (num === 8) gLevel.MINES = 12
    else gLevel.MINES = 30
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
    if (gBeforeFirstClick) {
        startTimer();
        makeMines();
        setMinesNegsCount();
        gBeforeFirstClick = false;
    }
    checkGameOver(i, j)
    if (gHint === true){
        hint(gBoard, i, j, true)
        setTimeout(() => {
            hint(gBoard, i, j,false)
            renderBoard(gBoard);
        }, 1000);
        gHint = false;
    }else if (!gBoard[i][j].isShown) gGame.shownCount++
    gBoard[i][j].isShown = true;
    expandShown(gBoard, i, j);
    checkVictory();
    renderBoard(gBoard);
}

function cellMarked(event, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return;
    if (!gBoard[i][j].isMarked && gMinesremain === 0) return;
    if (event.which === 3) {
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
        if (gBoard[i][j].isMarked) {
            gMinesremain--;
            gGame.markedCount++;
        } else {
            gMinesremain++;
            gGame.markedCount--;
        }
        if (gBeforeFirstClick) startTimer();
        checkVictory()
        renderBoard(gBoard)
    }
}

function checkGameOver(i, j) {
    var cell = gBoard[i][j];
    if (cell.isMine && !cell.isShown) {
        gLivesRemain--
        if (gLivesRemain === 0) {
            gVictory = false;
            endGame(gVictory)
        }
    }
}


function checkVictory() {
    console.log('checkVictory-shown'+gGame.shownCount)
    console.log('checkVictory-marked'+gGame.markedCount)
    console.log('checkVictory-neighbor'+gNieCellCounter)
    console.log(gLevel.SIZE ** 2)
    if ((gGame.shownCount + gGame.markedCount + gNieCellCounter) === (gLevel.SIZE ** 2)) {
        console.log('victory')
        endGame(gVictory)
    }
}


function endGame(res) {
    gGame.isOn = false;
    if (!res) {
        gElRes.innerHTML = LOSE;
    } else {
        gElRes.innerHTML = WIN;
    }
    clearInterval(gInterval)
    setTimeout(() => {
        leaderBord()
    }, 100);

    // renderLeaderBord()
}

function expandShown(board, cellI, cellJ) {
    var cell = board[cellI][cellJ];
    if (cell.isMarked || cell.isMine) return;
    if (!cell.minesAroundCount) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                var neighborCell = board[i][j];
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= board[i].length) continue;
                if (!neighborCell.isShown && !neighborCell.isMarked) {
                    gNieCellCounter++
                    neighborCell.isShown = true;
                    expandShown(board, i, j)
                }
            }
        }
    }
}


function startTimer() {
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
            strHTML += `<td data-i="${i}" data-j="${j}" onclick="cellClicked(${i}, ${j})"
             onmousedown="cellMarked(event, ${i}, ${j})" class="${className}" oncontextmenu="return false;">`;
            strHTML += cell.isMarked ? `<span class="flag">${FLAG}</span>` : cell.isMine ? MINE : cell.minesAroundCount ? `${cell.minesAroundCount}` : '';
            strHTML += ' </td>'
        }
        strHTML += '</tr>';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

    var elMinesremain = document.querySelector('.mines span');
    elMinesremain.innerHTML = gMinesremain

    var elLivesRemain = document.querySelector('.lives span');
    elLivesRemain.innerHTML = gLivesRemain;
}

function leaderBord() {
    var name = prompt('Please enter your name')
    var player = {
        name: name,
        time: gElTimer.innerHTML
    };
    if (gElRes.innerHTML = WIN) {
        gPlayersList.push(player)
    }
    gLeaderBords = gPlayersList.sort((p1, p2) => { return p1.time - p2.time })
    console.log(gLeaderBords)
    console.log(gPlayersList)
    renderLeaderBord()
}

function renderLeaderBord() {
    var strHTML = '';
    for (var i = 0; i < gLeaderBords.length; i++) {
        strHTML += '<tr>';
            var cell = gLeaderBords[i];
            var name = cell.name;
            var time = cell.time;
            strHTML += `<td class="leaders">`;
            strHTML += `${i+1}. ${name} - ${time} seconds ` 
            strHTML += ' </td>'
        
        strHTML += '</tr>';
    }
    var gElLeaderBords = document.querySelector('.leaders');
    gElLeaderBords.innerHTML = strHTML;
}

function hint(board, cellI, cellJ, open){
    var cell = board[cellI][cellJ];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var neighborCell = board[i][j];
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            neighborCell.isShown = open;
        }
    }
    cell.isShown = open;
}

function useHint(){
    if(gOpenHint === 0) return
    gHint = true;
    gOpenHint--
    var elgOpenHint = document.querySelector('.hint span');
    elgOpenHint.innerHTML = gOpenHint;
}