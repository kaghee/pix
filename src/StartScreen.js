import React, { Component } from 'react';
import './StartScreens.scss';
import animals from './assets/animals';
import stars from './assets/stars.txt';

export default class StartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      roomName: '',
    };
  }

  handleNameChange = (e) => {
    e.preventDefault();
    this.setState({
      name: e.target.value,
    });
  }

  handleRoomNameChange = (e) => {
    e.preventDefault();
    this.setState({
      roomName: e.target.value,
    });
  }

  handleJoin = () => {
    console.log('JOIN', this.state.roomName);

    let nameToUse = this.state.name;
    if (!nameToUse) {
      const animalsList = animals();
      nameToUse = `shy ${animalsList[Math.floor(Math.random() * animalsList.length)]}`;
    }
    this.props.enterChat(nameToUse, this.state.roomName || 'random');
  }

  getRandomRoomName = () => {
    const words = stars.split('\n');
    const random = Math.floor(Math.random() * words.length);
    return words.slice(random, random + 1)[0];
  }

  handleCreateRoom = () => {
    this.props.enterChat(this.state.name, 'newRoom');
    const roomName = this.getRandomRoomName();

    this.props.createRoom(this.state.name, roomName);
    this.props.history.push('/create');
  }

  // handlePlay = () => {
  //   let nameToUse = this.state.name;
  //   if (!nameToUse) {
  //     const animalsList = animals();
  //     nameToUse = `shy ${animalsList[Math.floor(Math.random() * animalsList.length)]}`;
  //   }
  //
  //   this.props.enterChat(nameToUse, 'default');
  //   this.props.history.push('/play');
  // }

  render() {
    return (
      <div className="start-wrapper">
        <div className="start-box">
          <div className="start-form">
            <input type="text" className="name" placeholder="Enter your name" maxLength="14" onChange={this.handleNameChange} />
            <div className="room-options">
              <div className="join-room">
                <input type="text" className="room-name" placeholder="Enter Room ID" maxLength="20" onChange={this.handleRoomNameChange} />
                <input className="btn join" type="button" value="Join Room" onClick={this.handleJoin} />
              </div>
              <input className="btn play" type="button" value="Create Room" onClick={this.handleCreateRoom} disabled={!this.state.name} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
