import React, { Component } from 'react';
import './Lobbies.css';

export default class Lobby extends Component {
  handlePlay = () => {
    console.log('play!');
  }

  render() {
    const { roomName } = this.props;

    return (
      <div className="start-wrapper">
        <div className="start-box">
          <div className="room-name-container">
            <input className="btn room-name-text" type="button" value={roomName} />
          </div>
          <div className="start-form">
            <p>
              Click the room name above to copy
              <br />
              & invite some friends!
            </p>
            <div className="rounds">
              <span className="label">Rounds:</span>
              <select defaultValue="5">
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="round-length">
              <span className="label">Draw time:</span>
              <input type="text" maxLength="3" />
            </div>
            <input className="btn play" type="button" value="Play!" onClick={this.handlePlay} />
          </div>
        </div>
        <div className="room-players">
          <span className="title">Players</span>
          <div className="players-container">
            {/*{this.props.players.map(player => (
              <div key={Math.random()} className="player">
                <FontAwesomeIcon className={`crown ${player.customData.roomOwner ? 'visible' : 'hidden'}`} icon="crown" />
                <FontAwesomeIcon className="icon" icon={player.customData.icon} />
                <span>{player.name}</span>
              </div>
            ))}*/}
          </div>
        </div>
      </div>
    );
  }
}
