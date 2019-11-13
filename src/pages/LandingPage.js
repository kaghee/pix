import React, { Component } from 'react';
import createRoom from '../chat';
import './Lobbies.scss';

export default class LandingPage extends Component {
  handleCreateRoom = () => {
    const {
      username,
      history,
    } = this.props;
    createRoom(username);
    history.push('/lobby');
  }

  render() {
    const { username } = this.props;

    return (
      <div className="start-wrapper">
        <div className="title">P I X I T</div>
        <div className="start-box">
          <div className="start-form">
            <input
              type="text"
              className="name"
              placeholder="Enter your name"
              maxLength="14"
              onChange={e => this.props.updateUsername(e.target.value)}
            />
            <div className="room-options">
              <div className="join-room">
                <input
                  type="text"
                  placeholder="Enter Room ID (optional)"
                  maxLength="20"
                  onChange={e => this.props.updateRoomName(e.target.value)}
                />
                <input className="btn join" type="button" value="Join Room" />
              </div>
              <input
                className="btn create"
                type="button"
                value="Create Private Room"
                onClick={() => this.handleCreateRoom(username)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
