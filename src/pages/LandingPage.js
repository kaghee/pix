import React, { Component } from 'react';
import './Lobbies.scss';

export default class LandingPage extends Component {
  createRoom = () => {
    const { userName } = this.props
    console.log('function hahah n', userName);
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
              maxLength="14"
              onChange={e => this.props.updateUserName(e.target.value)}
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
                onClick={() => this.createRoom(this.props.userName)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
