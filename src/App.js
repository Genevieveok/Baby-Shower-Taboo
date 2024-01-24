import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Scoreboard from './scoreboard';
import { tabooData } from './storage';  


const shuffleTabooCards = (drawPile) => {
  const shuffledCards = [...drawPile].sort(() => Math.random() - 0.5);
  return shuffledCards;
};

function App() {

  const [maxRounds, setMaxRounds] = useState(2);
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
  // const [passedCards, setPassedCards] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const closeWinnerModal = () => {
    setShowWinnerModal(false);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  const WinnerModal = ({ onClose, winner }) => {
    let message = '';
    switch (winner) {
      case 'A':
        message = <h1>Victory for Team A!! &#x1F389;</h1>;
        break;
      case 'B':
        message = <h1>Victory for Team B!! &#x1F389;</h1>;
        break;
      default:
        message = <h1>It's a Tie!! &#x1F389;</h1>;
    }
  
    return (
      <div className={`modal ${showWinnerModal ? 'modal-visible' : ''}`}>
        <div className="modal-content">
          <span className="close-button" onClick={onClose}>&times;</span>
          {message}
        </div>
      </div>
    );
  };

  const ErrorModal = ({ onClose, error }) => {
    let message = '';
    switch (error) {
      case 'no cards left':
        message = <h1>Game Over! No more cards &#x1F622;</h1>;
        break;
      default:
        message = <h1>Game Over! Please Reset Game.</h1>;
    }
  
    return (
      <div className={`modal ${showErrorModal ? 'modal-visible' : ''}`}>
        <div className="modal-content">
          <span className="close-button" onClick={onClose}>&times;</span>
          {message}
        </div>
      </div>
    );
  };

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
    setShowErrorModal(false);
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

  // The 'handlePass' functionality is temporarily disabled because the 'taboo' feature may serve as a substitute for passing
  // Additionally, there is an intermittent bug observed during the transition from 'pass' to 'correct,' where card changes may not occur promptly.
  // const handlePass = () => {
  //   if (gameState.gameStarted && gameState.timer > 0) {
  //     setGameState((prev) => {
  //       let nextCardIndex = (prev.currentCardIndex + 1) % drawPile.length;

  //       // Check for immediate repetition and adjust nextCardIndex
  //       while (passedCards.includes(drawPile[nextCardIndex].guessWord) && passedCards.length < drawPile.length) {
  //         nextCardIndex = (nextCardIndex + 1) % drawPile.length;
  //       }

  //       setCurrentCard(drawPile[nextCardIndex]);

  //       return {
  //         ...prev,
  //         currentCardIndex: nextCardIndex,
  //       };
  //     });

  //     setPassedCards((prev) => [...prev, currentCard.guessWord]);
  //   }
  // };
  

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
    // setPassedCards([]);
  };

  useEffect(() => {
    
    if (gameState.roundNum + 1 === maxRounds && gameState.teamTurn === 'B' && gameState.timer === 0) {
      setShowWinnerModal(true);
    }

    if (drawPile.length === 0 ) {
      setShowErrorModal(true);
    }
  }, [gameState.roundNum, maxRounds, gameState.teamTurn, gameState.timer, gameState.score.A, gameState.score.B, drawPile.length]);

  const renderGameOverContent = () => {
    if (showErrorModal) {
      return <ErrorModal onClose={closeErrorModal} error={'no cards left'} />;
    }
  
    let champ = ''
    if (gameState.score.A > gameState.score.B){
      champ = 'A'
    } else if (gameState.score.A < gameState.score.B){
      champ = 'B'
    }
    if (showWinnerModal) {
      return <WinnerModal onClose={closeWinnerModal} winner={champ} />;
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
              {gameState.timer === 0 ? <h3>Time's Up!</h3> : <h3>Time: {gameState.timer} seconds</h3>}
              {currentCard && (
                <div>
                  <div className="taboo-card">
                    <div className="title-box">
                      <div className="card-title">{currentCard.guessWord}</div>
                    </div>
                    <ul className="taboo-words">
                      {currentCard.tabooWords.map((taboo, index) => (
                      <li key={index}>{taboo}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <button className="buttontaboo" onClick={handleTaboo} disabled={buttonsDisabled || drawPile.length === 0}>
              &#x2716;
              </button> 
              {/* <button className="button"  onClick={handlePass} disabled={buttonsDisabled || drawPile.length === 0}>
                Pass
              </button> */}
              <button
              className={`buttoncorrect ${buttonsDisabled || drawPile.length === 0 ? 'disabled' : ''}`}
              onClick={handleCorrect}
              disabled={buttonsDisabled || drawPile.length === 0}>
              &#x2714;
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
                <label style={{ marginRight: '6px' }}>Select number of rounds:</label>
                <select value={maxRounds} onChange={(e) => setMaxRounds(parseInt(e.target.value, 10))}>
                  <option value={1}>1 Round</option>
                  <option value={2}>2 Rounds</option>
                  <option value={3}>3 Rounds</option>
                </select>
              </div>
              <br></br>
              <div>
                <label style={{ marginRight: '6px' }}>Set game duration:</label>
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
