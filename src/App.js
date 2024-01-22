import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Scoreboard from './scoreboard';


const shuffleTabooCards = (drawPile) => {
  const shuffledCards = [...drawPile].sort(() => Math.random() - 0.5);
  return shuffledCards;
};

function App() {
  const tabooData = [
    { guessWord: 'Apple', tabooWords: ['Fruit', 'Red', 'Tree','ADAM','EVE'] },
    { guessWord: 'Orange', tabooWords: ['Fruit', 'Red', 'Tree','ADAM','EVE'] },
    { guessWord: 'peas', tabooWords: ['Fruit', 'Green', 'Pod', 'ADAM','EVE']},
    { guessWord: 'goat', tabooWords: ['Fruit', 'Red', 'Tree', 'ADAM','EVE'] },
  ];

  const [maxRounds, setMaxRounds] = useState(3);
  const [maxTime, setMaxTime] = useState(30);
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
  const [passedCards, setPassedCards] = useState([]);

  const handleTimeout = useCallback(() => {
    setGameState((prev) => {
      if (!prev) {
        return {
          round: 1,
          teamTurn: 'A',
          timer: 0,
          score: { A: 0, B: 0 },
          gameStarted: false,
        };
      }
      return { ...prev, timer: 0 };
    });

    if (gameState.roundNum + 1 === maxRounds && gameState.teamTurn === 'B') {
      setButtonsDisabled(true);
      // console.log(`Game Over!!!!\nTeam A: ${gameState.score.A}, Team B: ${gameState.score.B}`);
    }
  }, [maxRounds, gameState.roundNum, gameState.teamTurn]);

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


  useEffect(() => {
    if (drawPile.length > 0) {
      setCurrentCard(drawPile[0]);
    }
  }, [drawPile]);


  const startTimer = () => {
    const validRounds = Math.min(maxRounds, 3);
    if (gameState.round <= validRounds) {
      setGameState((prev) => ({ ...prev, timer: maxTime, gameStarted: true }));
      if (gameState.teamTurn === 'B') {
        setGameState((prev) => ({ ...prev, roundNum: gameState.roundNum + 1 }));
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
      const shuffledCards = shuffleTabooCards(drawPile);
      setDrawPile(shuffledCards);
      startTimer();
      setButtonsDisabled(false);
    }
  };

  // const handlePass = () => {
  //   if (gameState.gameStarted && gameState.timer > 0){
  //     const passedCard = drawPile[gameState.currentCardIndex];

  //     const nextCardIndex = (gameState.currentCardIndex + 1) % drawPile.length;
  //     setCurrentCard(drawPile[nextCardIndex]);
  //     setDrawPile((prev) => [
  //       ...prev.slice(0, gameState.currentCardIndex),
  //       ...prev.slice(gameState.currentCardIndex + 1),
  //       passedCard,
  //     ]);
  //     setGameState((prev) => ({ ...prev, currentCardIndex: nextCardIndex }));
  //   }
  // };

  
  const handlePass = () => {
    if (gameState.gameStarted && gameState.timer > 0) {
      setGameState((prev) => {
        let nextCardIndex = (prev.currentCardIndex + 1) % drawPile.length;

        // Check for immediate repetition and adjust nextCardIndex
        while (passedCards.includes(drawPile[nextCardIndex].guessWord) && passedCards.length < drawPile.length) {
          nextCardIndex = (nextCardIndex + 1) % drawPile.length;
        }

        setCurrentCard(drawPile[nextCardIndex]);

        return {
          ...prev,
          currentCardIndex: nextCardIndex,
        };
      });

      setPassedCards((prev) => [...prev, currentCard.guessWord]);
    }
  };
  

const handleCorrect = () => {
  if (gameState.gameStarted && gameState.timer > 0 && drawPile.length > 0) {
    setGameState((prev) => {
      const nextCardIndex = (prev.currentCardIndex + 1) % drawPile.length;
      setCurrentCard(drawPile[nextCardIndex]);

      return {
        ...prev,
        score: {
          ...prev.score,
          [prev.teamTurn]: prev.score[prev.teamTurn] + 1,
        },
        currentCardIndex: nextCardIndex,
      };
    });
    setDrawPile((prev) => shuffleTabooCards(prev.slice(1))); // Only shuffle remaining cards
  } else {
    console.log('draw pile length after:', drawPile.length);
  }
};


const handleTaboo = () => {
  if (gameState.gameStarted && gameState.timer > 0) {
    setGameState((prev) => {
      const nextCardIndex = (prev.currentCardIndex + 1) % drawPile.length;
      setCurrentCard(drawPile[nextCardIndex]);

      return {
        ...prev,
        currentCardIndex: nextCardIndex,
      };
    });

    setDrawPile((prev) => shuffleTabooCards(prev.slice(1))); // Only shuffle remaining cards
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
    const shuffledCards = shuffleTabooCards(tabooData);
    setDrawPile(shuffledCards);
    setButtonsDisabled(false);
    setPassedCards([]);
  };

  const renderGameOverContent = () => {
    if (drawPile.length === 0) {
      return <h1>Game Over! No more cards &#x1F622;</h1>;
    }

    if (gameState.roundNum + 1 === maxRounds && gameState.teamTurn === 'B' && gameState.timer === 0) {
      // return <h1>Game Over. Scores: Team A - {gameState.score.A}, Team B - {gameState.score.B}</h1>;
      if (gameState.score.A > gameState.score.B) {
        return <h1>Team A are the Winners!! &#x1F389;</h1>
      } else if (gameState.score.A < gameState.score.B) {
        return <h1>Team B are the Winners!! &#x1F389;</h1>
      } else {
        return <h1>It's a Tie!!&#x1F389; </h1>
      }
    }
    return null;
  };

  return (
    <div className="App">
      <div className="container mt-5">
        <div id="game-container">
          {gameState.gameStarted ? (
            <>
              <h1>ROUND {gameState.roundNum + 1}</h1>
              <h2>Team {gameState.teamTurn}'s Turn</h2>
              <Scoreboard score={gameState.score} />
              <br></br>
              <h3>Timer: {gameState.timer} seconds</h3>
              {/* <h4>Score: Team A - {gameState.score.A}, Team B - {gameState.score.B}</h4> */}
              {currentCard && (
                <div>
                  <div class="taboo-card">
                    <div class="title-box">
                      <div class="card-title">{currentCard.guessWord}</div>
                    </div>
                    <ul class="taboo-words">
                      {currentCard.tabooWords.map((taboo, index) => (
                      <li key={index}>{taboo}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* <button className="button" onClick={handleCorrect} disabled={buttonsDisabled || drawPile.length === 0}>
                Correct
              </button> */}
              <button
              className={`buttoncorrect ${buttonsDisabled || drawPile.length === 0 ? 'disabled' : ''}`}
              onClick={handleCorrect}
              disabled={buttonsDisabled || drawPile.length === 0}>
              Correct
              </button>
              <button className="button"  onClick={handlePass} disabled={buttonsDisabled || drawPile.length === 0}>
                Pass
              </button>
              <button className="buttontaboo" onClick={handleTaboo} disabled={buttonsDisabled || drawPile.length === 0}>
                Taboo
              </button>
              <br></br>
              <br></br>
              {gameState.timer === 0 && gameState.round <= maxRounds && (
                <button onClick={continueGame} disabled={buttonsDisabled || drawPile.length === 0}>
                  Next Turn
                </button>
              )}
              <br></br>
              <br></br>
              <button onClick={handleResetGame}>Reset Game</button>
              <br></br>
              <br></br>
            </>
          ) : (
            <>
              <h1>Baby Shower Taboo!</h1>
              <br></br>
              <div>
                <label>Select number of rounds:</label>
                <select value={maxRounds} onChange={(e) => setMaxRounds(parseInt(e.target.value, 10))}>
                  <option value={1}>1 Round</option>
                  <option value={2}>2 Rounds</option>
                  <option value={3}>3 Rounds</option>
                </select>
              </div>
              <br></br>
              <div>
                <label>Set game duration:</label>
                <select value={maxTime} onChange={(e) => setMaxTime(parseInt(e.target.value, 10))}>
                <option value={15}>15 Seconds</option>
                  <option value={30}>30 Seconds</option>
                  <option value={60}>60 Seconds</option>
                  <option value={90}>90 Seconds</option>
                  <option value={120}>120 Seconds</option>
                </select>
              </div>
              <br></br>
              <button onClick={startTimer}>Start Game</button>
            </>
          )}
          {renderGameOverContent()}
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default App;
