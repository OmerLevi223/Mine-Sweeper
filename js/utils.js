function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}


function getRandomEmptyLocation(emptyLocations) {
    var randomIndex = getRandomInt(0, emptyLocations.length)
    var emptyLocation = emptyLocations[randomIndex];
    return emptyLocation
}

function getEmptyLocations(gBoard) {
    var emptyLocations = []
    for (var i = 1; i < gBoard.length; i++) {
        for (var j = 1; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine) {
                emptyLocations.push({ i: i, j: j });
            }
        }
    }
    return emptyLocations;
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE)
            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

//** TIMER */

// function pad(val) {
//     let valString = val + ''
//     if (valString.length < 2) return '0' + valString
//     return valString
// }

// gStartTime = Date.now()
// function timer() {
//     //NOTICE: WE NEED GLOBAL START TIME - gStartTime
//     var timeDiff = Date.now() - gStartTime
//     //   var currTime = new Date(timeDiff)
//     //   return currTime //shows in milliseconds
//     //OR
//     currTime = new Date(timeDiff)
//     var timeStr = pad(currTime.getMinutes()) //pad make it 01, 02 and so on
//     timeStr += ':' + pad(currTime.getSeconds())
//     return timeStr
// }

