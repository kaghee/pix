import React, { Component } from 'react';
import SocketContext from './SocketContext';
import Scoreboard from './Scoreboard';
import Chat from './chat/Chat';
import Canvas from './canvas/Canvas';
import WordsModal from './WordsModal';
import './App.scss';
import defaultWords from './assets/words/default.txt';

export default class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingWordsModal: false,
      wordOptions: [],
    };
  }

  getRandomWord = () => {
    const words = defaultWords.split('\n');
    return words[Math.floor(Math.random() * words.length)];
  }

  openWordsModal = () => {
    this.setState({ showingWordsModal: true });
  }

  hideWordsModal = () => {
    this.setState({ showingWordsModal: false });
  }

  startRound = () => {
    this.openWordsModal();
    const wordOptions = [this.getRandomWord(), this.getRandomWord(), this.getRandomWord()];
    this.setState({ wordOptions });
  }

  render() {
    return (
      <div className="wrapper">
        <WordsModal showing={this.state.showingWordsModal} handleClose={this.hideWordsModal} words={this.state.wordOptions} />
        <button className="start-btn" type="button" onClick={this.startRound}>G O !</button>
        <Scoreboard players={this.props.players} />
        <div className="middle">
          <div className="title">P I X I T</div>
          <SocketContext.Consumer>
            {socket => <Canvas socket={socket} />}
          </SocketContext.Consumer>
        </div>
        <Chat
          name={this.props.user}
          messages={this.props.messages}
          updateMessage={this.props.sendMessage}
        />
      </div>
    );
  }
}
