import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Scoreboard(props) {
  return (
    <div className="scoreboard-wrapper">
      <ul className="scoreboard">
        {props.players.map(player => (
          <li key={player.id} className={`player ${props.finishedPlayers.includes(player.name) ? 'finished' : ''}`}>
            <span>{player.name}</span>
            <FontAwesomeIcon className="icon" icon={player.customData.icon} />
          </li>
        ))}
      </ul>
      <div className="screenshot">
        <FontAwesomeIcon className="icon" icon="camera-retro" onClick={props.takeScreenshot} />
      </div>
    </div>
  );
}

export default Scoreboard;
