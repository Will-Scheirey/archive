var rowIndex = 0, letterIndex = 0;

var word = aw1[randomIntFromInterval(0, aw1.length - 1)];
console.log(word);

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

function guessLetter(letter) {
    letter = letter.toLowerCase();
    if (letterIndex < 5) {
        var letterDiv = document.getElementsByClassName("row")[rowIndex].children[letterIndex];
        letterDiv.children[0].innerHTML = letter;
        letterIndex++;
    }
}

function deleteLetter() {
    if (letterIndex > 0) {
        letterIndex--;
        var row = document.getElementsByClassName("row")[rowIndex]
        row.children[letterIndex].children[0].innerHTML = "";
    }
}

function guessRow() {
    var row = document.getElementsByClassName("row")[rowIndex];
    var letters = row.children;
    var wordGuess = "";
    for (var i = 0; i < 5; i++) {
        wordGuess += letters[i].children[0].innerHTML;
    }
    if (wordGuess.length != 5) {
        return;
    }
    letterIndex = 0;
    if (!allWords.includes(wordGuess)) {
        for (var i = 0; i < 5; i++) {
            letters[i].children[0].innerHTML = "";
        }
        return;
    }
    var won = true;
    for (var i = 0; i < 5; i++) {
        var letter = letters[i];
        var letterGuess = letter.children[0].innerHTML;
        if (word.charAt(i) == letterGuess) {
            letter.id = "correct";
        }
        else if (word.includes(letterGuess)) {
            letter.id = "present";
            won = false;
        }
        else {
            won = false;
        }
    }
    var keys = document.getElementsByClassName("key");
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i].innerHTML.toLowerCase();
        if (wordGuess.includes(key)) {
            if (word.includes(key)) {
                keys[i].id = "present";
                for (var n = 0; n < 5; n++) {
                    if (wordGuess.charAt(n) == key) {
                        if (word.charAt(n) == wordGuess.charAt(n)) {
                            keys[i].id = "correct";
                        }
                    }
                }
            }
            else {
                keys[i].id = "wrong";
            }
        }
    }
    if (won) {
        alert("YOU WON!");
    }
    rowIndex++;
    if (rowIndex > 5 && !won)
        alert("YOU LOST! The word was " + word);
}



function createBoard() {
    var board = document.getElementsByClassName("board")[0];
    var row = document.getElementsByClassName("row")[0];
    
    var letter = document.getElementsByClassName("letter")[0];
    
    var letterClone = letter.cloneNode(true);
    
    for (var i = 0; i < 4; i++) {
        row.appendChild(letterClone);
        letterClone = letter.cloneNode(true);
    }
    
    var rowClone = row.cloneNode(true);
    
    for (var i = 0; i < 5; i++) {
        board.appendChild(rowClone);
        rowClone = row.cloneNode(true);
    }
    
    var letters = document.getElementsByClassName("letter");
}

function setKeyBoardRow(row, letters, start) {
    var key = document.getElementsByClassName("key")[0];
    
    for (var i = start; i < letters.length; i++) {
        var keyClone = key.cloneNode(true);
        var letter = letters.charAt(i);
        keyClone.innerHTML = letter.toUpperCase();
        row.appendChild(keyClone);
    }
}

function createKeyBoard() {
    var row1Letters = "qwertyuiop";
    var row1 = document.getElementsByClassName("keyboard-row")[0];

    var row2Letters = "asdfghjkl";
    var row2 = document.getElementsByClassName("keyboard-row")[1];

    var row3Letters = "zxcvbnm";
    var row3 = document.getElementsByClassName("keyboard-row")[2];

    setKeyBoardRow(row1, row1Letters, 1);
    setKeyBoardRow(row2, row2Letters, 0);
    setKeyBoardRow(row3, row3Letters, 0);

    var key = document.getElementsByClassName("key")[0];
    var keyClone = key.cloneNode(true);
    keyClone.onclick = guessRow;
    keyClone.innerHTML = "ENTER";
    keyClone.id = "enter"

    row3.insertBefore(keyClone, row3.firstChild);

    
    keyClone = key.cloneNode(true);
    
    keyClone.onclick = deleteLetter;
    keyClone.innerHTML = "DELETE";
    keyClone.id = "delete"

    row3.appendChild(keyClone);


}


createBoard();
createKeyBoard();




