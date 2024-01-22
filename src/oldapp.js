import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// const tabooData = [
//   { guessWord: 'Apple', tabooWords: ['Fruit', 'Red', 'Tree'] },
//   { guessWord: 'Orange', tabooWords: ['Fruit', 'Red', 'Tree'] },
//   { guessWord: 'peas', tabooWords: ['Fruit', 'Green', 'Pod'] },
//   { guessWord: 'goat', tabooWords: ['Fruit', 'Red', 'Tree'] },
//   { guessWord: 'melon', tabooWords: ['Fruit', 'Red', 'Tree'] },
//   { guessWord: 'food', tabooWords: ['Fruit', 'Green', 'Pod'] },
//   { guessWord: 'seee', tabooWords: ['Fruit', 'Red', 'Tree'] },
//   { guessWord: 'milk', tabooWords: ['Fruit', 'Red', 'Tree'] },
//   { guessWord: 'onions', tabooWords: ['Fruit', 'Green', 'Pod'] },
//   { guessWord: 'pizza', tabooWords: ['Fruit', 'Red', 'Tree'] },
//   { guessWord: 'tasty', tabooWords: ['Fruit', 'Red', 'Tree'] },
//   { guessWord: 'moist', tabooWords: ['Fruit', 'Green', 'Pod'] },
// ];


function App() {
  const tabooData = [
    { guessWord: 'Apple', tabooWords: ['Fruit', 'Red', 'Tree'] },
    { guessWord: 'Orange', tabooWords: ['Fruit', 'Red', 'Tree'] },
    { guessWord: 'peas', tabooWords: ['Fruit', 'Green', 'Pod'] },
    { guessWord: 'goat', tabooWords: ['Fruit', 'Red', 'Tree'] },
  
  ];
  const [maxRounds, setMaxRounds] = useState(3);
  const [gameState, setGameState] = useState({
    round: 1,
    teamTurn: 'A',
    timer: 0,
    currentCardIndex: 0,
    score: { A: 0, B: 0 },
    gameStarted: false,
    roundNum: 0,
  });
  const [currentCard, setCurrentCard] = useState(tabooData[0]);
  const [drawPile, setDrawPile] = useState([...tabooData]);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);



  const handleTimeout = useCallback(() => {
    setGameState((prev) => {
      if (!prev) {
        return { round: 1, teamTurn: 'A', timer: 0, score: { A: 0, B: 0 }, gameStarted: false };
      }
      return { ...prev, timer: 0 };
    });
  
    if (gameState.roundNum + 1 === maxRounds && gameState.teamTurn === 'B') {
      setButtonsDisabled(true); // Disable buttons when the game is over
      console.log(`Game Over!!!!\nTeam A: ${gameState.score.A}, Team B: ${gameState.score.B}`);
    }
  }, [maxRounds, gameState.roundNum, gameState.teamTurn, gameState.score.A, gameState.score.B]);

  

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
  

  // const shuffleTabooCards = () => {
  //   const shuffledCards = [...drawPile].sort(() => Math.random() - 0.5);
  //   setCurrentCard(shuffledCards[0]);
  //   setDrawPile(shuffledCards);
  // };
  const shuffleTabooCards = () => {
    const shuffledCards = [...drawPile].sort(() => Math.random() - 0.5);
    setDrawPile(shuffledCards);
  };
  
  useEffect(() => {
    if (drawPile.length > 0) {
      setCurrentCard(drawPile[0]);
    }
  }, [drawPile]);
  

  const startTimer = () => {
    const validRounds = Math.min(maxRounds, 3);
    if (gameState.round <= validRounds) {
      setGameState((prev) => ({ ...prev, timer: 4, gameStarted: true}));
      if (gameState.teamTurn === 'B') {
        setGameState((prev) => ({ ...prev, roundNum: gameState.roundNum+1 }));
      }
    }
  };
  
  const continueGame = () => {
    const nextTeam = gameState.teamTurn === 'A' ? 'B' : 'A';
    if (gameState.round <= maxRounds) {
      if (nextTeam === 'B') {
        setGameState((prev) => ({ ...prev, teamTurn: nextTeam, round: prev.round + 1 }));
      } else {
        setGameState((prev) => ({ ...prev, teamTurn: nextTeam }));
      }
      shuffleTabooCards();
      startTimer();
      setButtonsDisabled(false); // Enable buttons
    }
  };
  

  // const handlePass = () => {
  //   const nextCardIndex = (gameState.currentCardIndex + 1) % tabooData.length;
  //   setCurrentCard(tabooData[nextCardIndex]);
  //   setGameState((prev) => ({ ...prev, currentCardIndex: nextCardIndex }));
  // };
  const handlePass = () => {
    const passedCard = drawPile[gameState.currentCardIndex];
  
    const nextCardIndex = (gameState.currentCardIndex + 1) % drawPile.length;
    setCurrentCard(drawPile[nextCardIndex]);
    setDrawPile((prev) => [...prev.slice(0, gameState.currentCardIndex), ...prev.slice(gameState.currentCardIndex + 1), passedCard]);
    setGameState((prev) => ({ ...prev, currentCardIndex: nextCardIndex }));
  };
  
  // const handleCorrect = () => {
  //   if (gameState.gameStarted && gameState.timer > 0) {
  //     const nextCardIndex = (gameState.currentCardIndex + 1) % drawPile.length;
  //     setGameState((prev) => ({
  //       ...prev,
  //       score: {
  //         ...prev.score,
  //         [prev.teamTurn]: prev.score[prev.teamTurn] + 1,
  //       },
  //       currentCardIndex: nextCardIndex,
  //     }));
  //     setDrawPile((prev) => prev.filter((_, index) => index !== gameState.currentCardIndex));
  //     setCurrentCard(drawPile[nextCardIndex]);
  //   }
  // };

  const handleCorrect = () => {
    if (gameState.gameStarted && gameState.timer > 0) {
      setGameState((prev) => ({
        ...prev,
        score: {
          ...prev.score,
          [prev.teamTurn]: prev.score[prev.teamTurn] + 1,
        },
        currentCardIndex: (prev.currentCardIndex + 1) % drawPile.length,
      }));
  
      setDrawPile((prev) => {
        const nextCardIndex = (gameState.currentCardIndex + 1) % prev.length;
        setCurrentCard(prev[nextCardIndex]);
        return prev.filter((_, index) => index !== gameState.currentCardIndex);
      });
    }
  };
  

  const handleTaboo = () => {
    const nextCardIndex = (gameState.currentCardIndex + 1) % drawPile.length;
  
    if (drawPile.length > 0) {
      setCurrentCard(drawPile[nextCardIndex]);
      setDrawPile((prev) => prev.filter((_, index) => index !== gameState.currentCardIndex));
      setGameState((prev) => ({ ...prev, currentCardIndex: nextCardIndex }));
    } 
  };


  const handleResetGame = () => {
    setGameState({
      round: 1,
      teamTurn: 'A',
      timer: 0,
      currentCardIndex: 0,
      score: { A: 0, B: 0 },
      gameStarted: false,
      roundNum: 0,
    });
    setDrawPile([...tabooData]);
    shuffleTabooCards();
    setButtonsDisabled(false); 
    console.log(drawPile)
  };


  
  
 
  
  const renderGameOverContent = () => {
    if (drawPile.length === 0) {
        // setButtonsDisabled(true); // Disable buttons when the game is over
        return <h1>Game Over because cards are finished</h1>;
      }

    if (gameState.roundNum + 1 === maxRounds && gameState.teamTurn === 'B' && gameState.timer === 0) {
      // setButtonsDisabled(true); // Disable buttons when the game is over
      return <h1>Game Over. Scores: Team A - {gameState.score.A}, Team B - {gameState.score.B}</h1>;
    }
    return null
  };
  

  return (
    <div className="App">
      <div className="container mt-5">
        <div id="game-container">
          {gameState.gameStarted ? (
            <>
              <h1>Round {gameState.roundNum + 1 }</h1>
              <h2>Team {gameState.teamTurn}'s Turn</h2>
              <h3>Timer: {gameState.timer} seconds</h3>
              <h4>Score: Team A - {gameState.score.A}, Team B - {gameState.score.B}</h4>
              {currentCard && (
                <div>
                  <h5>Current Card: {currentCard.guessWord}</h5>
                  <ul>
                    {currentCard.tabooWords.map((taboo, index) => (
                      <li key={index}>{taboo}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* <button onClick={handlePass} disabled={drawPile.length === 0}>Pass</button>
              <button onClick={handleCorrect} disabled={drawPile.length === 0}>Correct</button>
              <button onClick={handleResetGame}>Reset Game</button>
              <button onClick={handleTaboo} disabled={drawPile.length === 0}>Taboo</button>
              {gameState.timer === 0 && gameState.round <= maxRounds && (
                <button onClick={continueGame} disabled={drawPile.length === 0}>Continue</button>
               )} */}
              <button onClick={handlePass} disabled={buttonsDisabled || drawPile.length === 0}>Pass</button>
              <button onClick={handleCorrect} disabled={buttonsDisabled || drawPile.length === 0}>Correct</button>
              <button onClick={handleResetGame} >Reset Game</button>
              <button onClick={handleTaboo} disabled={buttonsDisabled || drawPile.length === 0}>Taboo</button>
              {gameState.timer === 0 && gameState.round <= maxRounds && (
                <button onClick={continueGame} disabled={buttonsDisabled|| drawPile.length === 0}>Continue</button>
              )}
              {/* <button onClick={continueGame} disabled={buttonsDisabled || drawPile.length === 0 ||( gameState.timer === 0 && gameState.round > maxRounds)}>Continue</button> */}
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
          {renderGameOverContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
