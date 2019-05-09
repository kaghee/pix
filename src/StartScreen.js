import React, { Component } from 'react';
import './StartScreens.scss';

export default class StartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      rooms: this.props.rooms,
    };
  }

  handleNameChange = (e) => {
    e.preventDefault();
    this.setState({
      name: e.target.value,
    });
  }

  handleCreateRoom = () => {
    this.props.enterChat(this.state.name, 'newRoom');

    this.props.createRoom(this.state.name);
    this.props.history.push('/create');
  }

  handlePlay = () => {
    this.props.enterChat(this.state.name, 'default');
    this.props.history.push('/play');
  }

  render() {
    const roomOptions = this.state.rooms.map((room) => {
      return (
        <option value={room} key={room}>{room}</option>
      );
    });

    return (
      <div className="start-wrapper">
        <div className="start-box">
          <div className="start-form">
            <input type="text" className="name" placeholder="Enter your name" maxLength="14" onChange={this.handleNameChange} />
            <div>
              Join existing room:
              <select>
                {roomOptions}
              </select>
            </div>
            <div className="button-area">
              <input className="btn play" type="button" value="Create Room" onClick={this.handleCreateRoom} disabled={!this.state.name} />
              <input className="btn play" type="button" value="Play!" onClick={this.handlePlay} disabled={!this.state.name} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
