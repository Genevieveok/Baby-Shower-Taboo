// scoreboard.js

import React from 'react';
import './scoreboard.css';

const Scoreboard = ({ score }) => {
  return (
    <div className="scoreboard-container">
      <div className="team-score">
        <span className="team-name">Team A</span>
        <span className="team-score-value">{score.A}</span>
      </div>
      <div className="divider"></div>
      <div className="team-score">
        <span className="team-name">Team B</span>
        <span className="team-score-value">{score.B}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
