# Wordle Exercise

In this exercise you will build your own version of the game Wordle.

Here is the [original](https://www.nytimes.com/games/wordle/index.html) version for anyone not familiar with it.

## Instructions

You have been provided with (basic) HTML to get you started - feel free to expand on this as you wish. You will also want to introduce some styling using CSS.

You should add your own JS to the file `main.js` to make the game functional.

1. Randomly choose a 'target' word from the list

2. When the user clicks a letter in the on-screen keyboard, it should add the letter to the current guess

3. When the user presses the enter button:

- Ensure the current guess has five letters
- Provide colour feedback for the letter positions

## Extensions (optional)

- Link up the user's physical keyboard using `keypress` event handlers
- Add a delete button to the on-screen keyboard
- Implement Wordle's "Hard Mode" (any revealed hints must be used in subsequent guesses)
- Keep a record the user's score for each game and store them in a statistics panel on the page
