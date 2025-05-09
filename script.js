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
        players.setAttribute('class', 'players active player'); // Player X starts first
        playerSign = 'X'; // Start with Player X
    }
    selectOBtn.onclick = () => {
        selectBox.classList.add('hide');
        playBoard.classList.add('show');
        players.setAttribute('class', 'players active player');
        playerSign = 'O'; // Player O starts
    }
}

let playerXIcon = "fas fa-xmark",
    playerOIcon = "far fa-circle",
    playerSign = 'X', // Default to X for first move
    runBot = false; // Bot should wait until player makes a move

function clickedBox(element) {
    if (element.innerHTML !== '') return; // Prevent clicking on already filled box
    
    // Handle player turn
    if (players.classList.contains('player')) {
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        element.setAttribute('id', 'X');
        players.classList.remove('active'); // Switch turn
        playerSign = 'O'; // Set next turn to Player O
    } else {
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        element.setAttribute('id', 'O');
        players.classList.add('active'); // Switch turn
        playerSign = 'X'; // Set next turn to Player X
    }

    // After a move, check if someone has won or if the board is full
    selectWinner();
    playBoard.style.pointerEvents = "none"; // Disable clicks on the board while waiting for bot
    setTimeout(() => {
        bot();
    }, Math.random() * 1000 + 200); // Add a random delay for bot move
}

function bot() {
    // Bot should only play when it's its turn
    if (!runBot) return;

    let arr = [];
    // Find empty boxes
    for (let i = 0; i < allBox.length; i++) {
        if (allBox[i].innerHTML === '') {
            arr.push(i);
        }
    }

    if (arr.length > 0) {
        let randomBox = arr[Math.floor(Math.random() * arr.length)];
        allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;
        allBox[randomBox].setAttribute('id', 'O');
        allBox[randomBox].style.pointerEvents = 'none';
        players.classList.add('active'); // Player X's turn
        playerSign = 'X';
        selectWinner();
        playBoard.style.pointerEvents = "auto"; // Enable board interaction again
    }
}

function checkIdSign(val1, val2, val3, sign) {
    if (getIdVal(val1) === sign && getIdVal(val2) === sign && getIdVal(val3) === sign) {
        return true;
    }
}

function selectWinner() {
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) ||
        checkIdSign(7, 8, 9, playerSign) || checkIdSign(1, 4, 7, playerSign) ||
        checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) ||
        checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {
        runBot = false; // Stop bot from moving after a win
        setTimeout(() => {
            playBoard.classList.remove('show');
            resultBox.classList.add('show');
        }, 700);
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
    } else if (Array.from(allBox).every(box => box.innerHTML !== '')) {
        // If no winner and all boxes are filled
        runBot = false;
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        wonText.textContent = "Match has been drawn!";
    }
}

replayBtn.onclick = () => {
    window.location.reload();
}
