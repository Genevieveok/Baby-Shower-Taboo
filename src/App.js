// src/App.js
import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // game logic goes here
    document.getElementById('myButton').addEventListener('click', function () {
      alert('Button Clicked!');
    });

    // Initialize game
    loadGame();
  }, []); // Empty dependency array means this effect runs once after the initial render

  function loadGame() {
    // Dynamically load game content
    // const gameContainer = document.getElementById('game-container');
    // gameContainer.innerHTML = '<h1>Welcome to Baby Shower Taboo Game!</h1>';

    // Save and retrieve data using storage.js
    // const exampleData = { score: 0, currentPlayer: 'Player 1' };
    // Replace saveData and getData with React state management
    // saveData(exampleData);

    // const retrievedData = getData();
    // console.log(retrievedData);

      // Dynamically load game content
    // Replace this part with React state management if needed
    // const gameContainer = document.getElementById('game-container');
    // gameContainer.innerHTML = '<h1>Welcome to Baby Shower Taboo Game!</h1>';
  }

  return (
    <div className="App">
      <div className="container mt-5">
        <div id="game-container">
          {/* Game content will be dynamically loaded here */}
          <button id="myButton" className="btn btn-primary">
            Click Me now!
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
