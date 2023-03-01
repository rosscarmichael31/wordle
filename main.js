import { WORDS, ALPHABET } from "./words.js";
import { DICTIONARY } from "./dictionary.js";

const keyboard = Array.from(document.querySelectorAll(".keyboard-letter"));
const guessDisplay = Array.from(document.querySelectorAll(".guess-letter"));
const messageDisplay = document.querySelector(".message-container");
const restartContainer = document.getElementById("restart-container");
const restartBtn = document.getElementById("restart");
const statsPlayed = document.getElementById("stats-played");
const statsPercent = document.getElementById("stats-percent");

restartContainer.classList.add("hidden");

let gameOver = false;
let gameWon = false;
let inputBlocked;
let currentRow = 0;
let currentColumn = 0;
const DELAY = 400;
const wordle = WORDS[Math.floor(Math.random() * WORDS.length)];
const guess = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

// Set stats in localStorage if not alread there
if (!localStorage.getItem("stats")) {
  console.log("called");
  let stats = {
    played: 0,
    winPercentage: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
  };
  localStorage.setItem("stats", JSON.stringify(stats));
}

// Update HTML with statistics
const displayStats = () => {
  let statsData = JSON.parse(localStorage.getItem("stats"));
  statsPlayed.innerHTML = statsData.played;

  let percent = Math.round(
    (100 * (statsData.played - statsData.guesses.fail)) / statsData.played
  );

  if (percent) {
    statsPercent.innerHTML = percent + "%";
  } else {
    statsPercent.innerHTML = 0 + "%";
  }
};

const updateStats = () => {
  let retrievedStats = JSON.parse(localStorage.getItem("stats"));
  retrievedStats.played++;

  gameWon
    ? retrievedStats.guesses[currentRow + 1]++
    : retrievedStats.guesses["fail"]++;

  localStorage.setItem("stats", JSON.stringify(retrievedStats));
};

displayStats();

// Get 6 x 5 array of guesses
let guessDisplayGrid = [];
while (guessDisplay.length) {
  guessDisplayGrid.push(guessDisplay.splice(0, 5));
}

// Add letter to display grid
const addLetterToRow = (key) => {
  if (currentColumn < 5 && currentRow < 6) {
    guess[currentRow][currentColumn] = key;
    guessDisplayGrid[currentRow][currentColumn].innerHTML = key;

    currentColumn++;
  }
};

// Remove letter from display grid
const deleteLetter = () => {
  if (currentColumn >= 1) {
    currentColumn--;
    guess[currentRow][currentColumn] = "";
    guessDisplayGrid[currentRow][currentColumn].innerHTML = "";
  }
};

// Logic after guess is submitted
const checkRow = () => {
  const userWord = guess[currentRow].join("");

  if (userWord === wordle) {
    guessDisplayGrid[currentRow].forEach((letter, i) => {
      setTimeout(() => {
        guessDisplayGrid[currentRow][i].classList.add("flip");
        addCSSClass(letter, "green");
      }, DELAY * i);
    });

    gameWon = true;
    gameOver = true;

    setTimeout(() => {
      displayMessage("Well done!", DELAY * 25);
    }, DELAY * 5);

    updateStats();
    displayStats();

    setTimeout(() => {
      restartContainer.classList.remove("hidden");
    }, 6 * DELAY);

    return;
  } else if (userWord.length != 5) {
    displayMessage("Not enough letters");
  } else if (!DICTIONARY.includes(userWord)) {
    displayMessage("Word not in list!");

    // add shake animation class
    guessDisplayGrid[currentRow].forEach((item) => {
      item.classList.add("shake");
    });

    // remove shake animation class after 1sec
    setTimeout(() => {
      guessDisplayGrid[currentRow].forEach((letter) => {
        letter.classList.remove("shake");
      });
    }, DELAY * 2.5);
  } else if (currentRow === 5 && !gameWon) {
    addColoursToScreen(userWord);

    currentRow++;
    currentColumn = 0;

    setTimeout(() => {
      displayMessage("Unlcuky! It was " + wordle, DELAY * 25);

      updateStats();
      displayStats();
      restartContainer.classList.remove("hidden");
    }, 5 * DELAY);
    return;
  } else if (currentRow < 5) {
    addColoursToScreen(userWord);
    currentRow++;
    currentColumn = 0;
  }
};

// Add colours and flippping animation
const addColoursToScreen = () => {
  const display = [];
  let check = wordle;

  guessDisplayGrid[currentRow].forEach((item) => {
    display.push({ letter: item.innerHTML, colour: "grey" });
  });

  display.forEach((item, i) => {
    if (item.letter === wordle[i]) {
      item.colour = "green";
      check = check.replace(item.letter, "");
    }
  });

  display.forEach((item) => {
    if (check.includes(item.letter)) {
      item.colour = "yellow";
      check = check.replace(item.letter, "");
    }
  });

  inputBlocked = true;

  display.forEach((item, i) => {
    setTimeout(() => {
      addCSSClass(guessDisplayGrid[currentRow - 1][i], item.colour);
      addCSSClass(guessDisplayGrid[currentRow - 1][i], "flip");
      addColourToKeyboard(item.letter, item.colour);
      item.colour === "grey"
        ? addColourToKeyboard(item.letter, "inactive")
        : null;
    }, DELAY * i);
  });

  // Block user input until finished flip
  setTimeout(() => {
    inputBlocked = false;
  }, DELAY * 5);
};

// Add a CSS colour to a keyboard key, finding the key first
const addColourToKeyboard = (letterVal, colour) => {
  keyboard.forEach((letter) => {
    if (letter.innerHTML === letterVal) {
      addCSSClass(letter, colour);
    }
  });
};

// Add a CSS colour class to a HTML element
const addCSSClass = (element, cls) => {
  element.classList.add(cls);
};

// Show the user a message
const displayMessage = (message, delay = DELAY * 3.75) => {
  if (!messageDisplay.hasChildNodes()) {
    let messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageDisplay.append(messageElement);
    setTimeout(() => messageDisplay.removeChild(messageElement), delay);
  }
};

// Handle keyboard input
const handleClick = (key) => {
  if (!gameOver && !inputBlocked) {
    if (key.innerHTML === "Del") {
      deleteLetter();
    } else if (key.innerHTML === "Enter") {
      checkRow();
    } else addLetterToRow(key.innerHTML);
  }
};

// Handle physical keyboard input
const handleKeyboardEvent = (e) => {
  if (!gameOver && !inputBlocked) {
    if (e.key === "Enter") {
      checkRow();
    } else if (e.key === "Backspace") {
      deleteLetter();
    } else if (ALPHABET.includes(e.key)) {
      addLetterToRow(e.key);
    }
  }
};

// Event listeners

keyboard.forEach((key) => {
  key.addEventListener("click", () => handleClick(key));
});

document.addEventListener("keydown", (e) => handleKeyboardEvent(e));

restartBtn.addEventListener("click", () => {
  location.reload();
});

// Statistics modal
// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("icon-stats");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
