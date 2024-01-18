import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const tabooData = [
  { guessWord: 'Apple', tabooWords: ['Fruit', 'Red', 'Tree'] },
  { guessWord: 'Orange', tabooWords: ['Fruit', 'Red', 'Tree'] },
  { guessWord: 'peas', tabooWords: ['Fruit', 'Green', 'Pod'] },
  // Add more taboo word sets as needed
];

function App() {
  const [maxRounds, setMaxRounds] = useState(3);
  const [gameState, setGameState] = useState({
    round: 1,
    teamTurn: 'A',
    timer: 0,
    currentCardIndex: 0,
    score: { A: 0, B: 0 },
    gameStarted: false,
  });
  const [currentCard, setCurrentCard] = useState(tabooData[0]);

  useEffect(() => {
    shuffleTabooCards();
  }, []);

  const handleTimeout = useCallback(() => {
    setGameState((prev) => {
      if (!prev) {
        return { round: 1, teamTurn: 'A', timer: 0, score: { A: 0, B: 0 }, gameStarted: false };
      }
      return { ...prev, timer: 0 };
    });

    if (gameState.round < maxRounds || gameState.teamTurn === 'B') {
      setGameState((prev) => ({
        ...prev,
        round: prev.round + 1,
        teamTurn: 'A',
        timer: 0,
      }));
      shuffleTabooCards();
    } else {
      // Replace the alert with a modal or other UI element
      console.log(`Game Over!\nTeam A: ${gameState.score.A}, Team B: ${gameState.score.B}`);
    }
  }, [maxRounds, gameState.round, gameState.teamTurn, gameState.score.A, gameState.score.B]);

  useEffect(() => {
    if (gameState.timer > 0) {
      const timerInterval = setInterval(() => {
        setGameState((prev) => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);

      return () => clearInterval(timerInterval);
    } else {
      handleTimeout();
    }
  }, [gameState.timer, handleTimeout]);

  const shuffleTabooCards = () => {
    const shuffledCards = [...tabooData].sort(() => Math.random() - 0.5);
    setCurrentCard(shuffledCards[0]);
  };

  const startTimer = () => {
    const validRounds = Math.min(maxRounds, 3);
    if (gameState.round <= validRounds) {
      setGameState((prev) => ({ ...prev, timer: 10, gameStarted: true }));
    }
  };

  const continueGame = () => {
    const nextTeam = gameState.teamTurn === 'A' ? 'B' : 'A';
    if (gameState.round <= maxRounds) {
      shuffleTabooCards();
      setGameState((prev) => ({ ...prev, teamTurn: nextTeam }));
      startTimer();
    } else {
      console.log(`Game Over!\nTeam A: ${gameState.score.A}, Team B: ${gameState.score.B}`);
    }
  };

  const handlePass = () => {
    const nextCardIndex = (gameState.currentCardIndex + 1) % tabooData.length;
    setCurrentCard(tabooData[nextCardIndex]);
    setGameState((prev) => ({ ...prev, currentCardIndex: nextCardIndex }));
  };

  const handleCorrect = () => {
    const nextCardIndex = (gameState.currentCardIndex + 1) % tabooData.length;
    setGameState((prev) => ({
      ...prev,
      score: {
        ...prev.score,
        [prev.teamTurn]: prev.score[prev.teamTurn] + 1,
      },
      currentCardIndex: nextCardIndex,
    }));
    setCurrentCard(tabooData[nextCardIndex]);
  };

  const handleResetGame = () => {
    setGameState({
      round: 1,
      teamTurn: 'A',
      timer: 0,
      currentCardIndex: 0,
      score: { A: 0, B: 0 },
      gameStarted: false,
    });
    shuffleTabooCards();
  };

  const handleTaboo = () => {
    const nextCardIndex = (gameState.currentCardIndex + 1) % tabooData.length;
    setCurrentCard(tabooData[nextCardIndex]);
    setGameState((prev) => ({ ...prev, currentCardIndex: nextCardIndex }));
  };

  return (
    <div className="App">
      <div className="container mt-5">
        <div id="game-container">
          {gameState.gameStarted ? (
            <>
              <h1>Round {gameState.round}</h1>
              <h2>Team {gameState.teamTurn}'s Turn</h2>
              <h3>Timer: {gameState.timer} seconds</h3>
              <h4>Score: Team A - {gameState.score.A}, Team B - {gameState.score.B}</h4>
              <div>
                <h5>Current Card: {currentCard.guessWord}</h5>
                <ul>
                  {currentCard.tabooWords.map((taboo, index) => (
                    <li key={index}>{taboo}</li>
                  ))}
                </ul>
              </div>
              <button onClick={handlePass}>Pass</button>
              <button onClick={handleCorrect}>Correct</button>
              <button onClick={handleResetGame}>Reset Game</button>
              <button onClick={handleTaboo}>Taboo</button>
              {gameState.timer === 0 && gameState.round <= maxRounds && (
                <button onClick={continueGame}>Continue</button>
              )}
            </>
          ) : (
            <>
              <h1>Welcome to Baby Shower Taboo Game!</h1>
              <div>
                <label>Choose the number of rounds:</label>
                <select
                  value={maxRounds}
                  onChange={(e) => setMaxRounds(parseInt(e.target.value, 10))}
                >
                  <option value={1}>1 Round</option>
                  <option value={2}>2 Rounds</option>
                  <option value={3}>3 Rounds</option>
                </select>
              </div>
              <button onClick={startTimer}>Start Game</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
