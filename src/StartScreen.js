import React, { Component } from 'react';
import './StartScreens.scss';
import animals from './assets/animals.js';

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
    let nameToUse = this.state.name;
    if (!nameToUse) {
      const animalsList = animals();
      nameToUse = `shy ${animalsList[Math.floor(Math.random() * animalsList.length)]}`;
    }

    this.props.enterChat(nameToUse, 'default');
    this.props.history.push('/play');
  }

  render() {
    let joinRoomsBlock = '';
    if (this.state.rooms.length) {
      const roomOptions = this.state.rooms.map(room => <option value={room} key={room}>{room}</option>);
      joinRoomsBlock = (
        <div className="btn join-room">
          <select disabled={!this.state.name}>
            <option value="Join a Room" defaultValue>Join a Room</option>
            {roomOptions}
          </select>
        </div>
      );
    }

    return (
      <div className="start-wrapper">
        <div className="start-box">
          <div className="start-form">
            <input type="text" className="name" placeholder="Enter your name" maxLength="14" onChange={this.handleNameChange} />
            <div className="button-area">
              {joinRoomsBlock}
              <input className="btn play" type="button" value="Create Room" onClick={this.handleCreateRoom} disabled={!this.state.name} />
              <input className="btn play" type="button" value="Play!" onClick={this.handlePlay} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
