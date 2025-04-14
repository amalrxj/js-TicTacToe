const selectBox = document.querySelector('.select-box'),
    selectXBtn = selectBox.querySelector('.playerX'),
    selectOBtn = selectBox.querySelector('.playerO'),
    playBoard = document.querySelector('.play-board'),
    allBox = document.querySelectorAll('section span'),
    players = document.querySelector('.players'),
    resultBox = document.querySelector('.result-box'),
    wonText = resultBox.querySelector('.won-text'),
    replayBtn = resultBox.querySelector('button');

window.onload = () => {
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].setAttribute('onclick', 'clickedBox(this)');
    }
    selectXBtn.onclick = () => {
        selectBox.classList.add('hide');
        playBoard.classList.add('show');
    }
    selectOBtn.onclick = () => {
        selectBox.classList.add('hide');
        playBoard.classList.add('show');
        players.setAttribute('class', 'players active player');
    }
}

let playerXIcon = "fas fa-xmark",
    playerOIcon = "far fa-circle",
    playerSign = 'X',
    runBot = true;

function clickedBox(element) {
    if (players.classList.contains('player')) {
        playerSign = 'O';
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.add('active');
        element.setAttribute('id', playerSign);
    } else {
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        element.setAttribute('id', playerSign);
        players.classList.add('active');
    }
    selectWinner();
    playBoard.style.pointerEvents = "none";
    element.style.pointerEvents = 'none';
    let randomTimeDelay = (Math.random() * 1000 + 200).toFixed();
    setTimeout(() => {
        bot(runBot);
    }, randomTimeDelay);
}

function bot(runBot) {
    if (!runBot) return;

    let emptyBoxes = [];
    for (let i = 0; i < allBox.length; i++) {
        if (allBox[i].childElementCount === 0) {
            emptyBoxes.push(i);
        }
    }

    // Try to win or block
    let bestMove = getBestMove(emptyBoxes, "O"); // Try to win
    if (bestMove === -1) {
        bestMove = getBestMove(emptyBoxes, "X"); // Try to block player
    }

    // Pick random if nothing urgent
    if (bestMove === -1) {
        bestMove = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    }

    const chosenBox = allBox[bestMove];
    chosenBox.innerHTML = `<i class="${playerOIcon}"></i>`;
    chosenBox.setAttribute("id", "O");
    chosenBox.style.pointerEvents = "none";

    players.classList.remove("active");
    playerSign = "O";
    selectWinner();
    playBoard.style.pointerEvents = "auto";
    playerSign = "X";
}

function getBestMove(emptyBoxes, sign) {
    for (let i of emptyBoxes) {
        allBox[i].setAttribute("id", sign);
        if (checkWin(sign)) {
            allBox[i].removeAttribute("id");
            return i;
        }
        allBox[i].removeAttribute("id");
    }
    return -1;
}

function getIdVal(classname) {
    return document.querySelector(".box" + classname).id;
}

function checkIdSign(val1, val2, val3, sign) {
    if (getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign) {
        return true;
    }
}

function checkWin(sign) {
    return (
        checkIdSign(1, 2, 3, sign) ||
        checkIdSign(4, 5, 6, sign) ||
        checkIdSign(7, 8, 9, sign) ||
        checkIdSign(1, 4, 7, sign) ||
        checkIdSign(2, 5, 8, sign) ||
        checkIdSign(3, 6, 9, sign) ||
        checkIdSign(1, 5, 9, sign) ||
        checkIdSign(3, 5, 7, sign)
    );
}

function selectWinner() {
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) || checkIdSign(7, 8, 9, playerSign) || checkIdSign(1, 4, 7, playerSign) || checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) || checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {
        runBot = false;
        bot(runBot);
        setTimeout(() => {
            playBoard.classList.remove('show');
            resultBox.classList.add('show');
        }, 700);
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
    } else {
        if (getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != "") {
            runBot = false;
            bot(runBot);
            setTimeout(() => {
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700);
            wonText.textContent = "Match has been drawn!";
        }
    }
}

replayBtn.onclick = () => {
    window.location.reload();
}
