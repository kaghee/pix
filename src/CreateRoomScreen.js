import React, { Component } from 'react';
import './css/StartScreens.scss';

export default class CreateRoomScreen extends Component {
  handlePlay = () => {
    this.props.history.push('/play');
  }

  handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = this.props.roomName;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  render() {
    return (
      <div className="start-wrapper">
        <div className="start-box">
          <div className="start-form">
            <div className="room-name-container">
              <input className="btn room-name-text" type="button" onClick={this.handleCopy} value={this.props.roomName} />
              <p>
                Click the room name above to copy
                <br />
                & invite some friends!
              </p>
            </div>
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
        <div className="room-users">
          <ul>
            {this.props.players.map(player => (
              <li key={Math.random()} className="player">{player.name}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
