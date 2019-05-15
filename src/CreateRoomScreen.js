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
          <div className="room-name-container">
            <input className="btn room-name-text" type="button" onClick={this.handleCopy} value={this.props.roomName} />
          </div>
          <div className="start-form">
            <p>
              Click the room name above to copy
              <br />
              & invite some friends!
            </p>
            <div className="rounds">
              <span className="label">Rounds:</span>
              <select defaultValue="5" disabled={!this.props.isCurrentUserOwner}>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="round-length">
              <span className="label">Draw time:</span>
              <input type="text" maxLength="3" disabled={!this.props.isCurrentUserOwner} />
            </div>
            <input className="btn play" type="button" value="Play!" disabled={!this.props.isCurrentUserOwner} onClick={this.handlePlay} />
          </div>
        </div>
        <div className="room-players">
          <span>Players</span>
          <div className="players-container">
            <div key="123">12345 78911234</div>
            <div key="4254">masik jatekos</div>
            <div key="dfghdgf">valaki</div>
            <div key="54dgffgfdgf">masik jatekos</div>
            {this.props.players.map(player => (
              <div key={Math.random()} className="player">{player.name}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
