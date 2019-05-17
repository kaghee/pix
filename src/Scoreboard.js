import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Scoreboard(props) {
  props.players.map((player) => console.log(player));
  console.log("fini", props.finishedPlayers);
  return (
    <ul className="scoreboard">
      {props.players.map(player => (
        <li key={player.id} className={`player ${props.finishedPlayers.includes(player.name) ? 'finished' : ''}`}>
          <span>{player.name}</span>
          <FontAwesomeIcon className="icon" icon={player.customData.icon} />
        </li>
      ))}
    </ul>
  );
}

export default Scoreboard;
