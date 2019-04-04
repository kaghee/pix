import React from 'react';

function Scoreboard(props) {
  return (
    <ul className="scoreboard">
      {props.players.map((player) => {
        return (
          <li key={player.id} className="player">{player.name}</li>
        );
      })}
    </ul>
  );
}

export default Scoreboard;
