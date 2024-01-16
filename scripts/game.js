document.getElementById('game-container').addEventListener('click', function (event) {
    if (event.target.id === 'myButton') {
        alert('Button Clicked!');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // initialize game
    loadGame();
});

function loadGame() {
    // dynamically load game content
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '<h1>Welcome to Baby Shower Taboo Game!</h1>';

    // save and retrieve data using storage.js
    const exampleData = { score: 0, currentPlayer: 'Player 1' };
    saveData(exampleData);

    const retrievedData = getData();
    console.log(retrievedData);
}

// add game logic here
// use saveData and getData functions from storage.js to manage game state.
