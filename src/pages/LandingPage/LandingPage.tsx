import { History } from 'history';
import React, { Component } from 'react';

import createRoom from '../../chat';

import '../Lobbies.css';

interface Props {
  username: string
  history: History
  updateUsername(username: string): void
  updateRoomName(roomName: string): void
}

export default class LandingPage extends Component<Props, {}> {
  handleCreateRoom = () => {
    const {
      username,
      history,
    } = this.props;
    createRoom(username);
    history.push('/lobby');
  }

  render() {
    return (
      <div className="start-wrapper">
        <div className="title">P I X I T</div>
        <div className="start-box">
          <div className="start-form">
            <input
              type="text"
              className="name"
              placeholder="Enter your name"
              maxLength={14}
              value={this.props.username}
              onChange={e => this.props.updateUsername(e.target.value)}
            />
            <div className="room-options">
              <div className="join-room">
                <input
                  type="text"
                  placeholder="Enter Room ID (optional)"
                  maxLength={20}
                  onChange={e => this.props.updateRoomName(e.target.value)}
                />
                <input className="btn join" type="button" value="Join Room" />
              </div>
              <input
                className="btn create"
                type="button"
                value="Create Private Room"
                onClick={() => this.handleCreateRoom()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
