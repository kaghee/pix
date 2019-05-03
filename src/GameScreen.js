import React, { Component } from 'react';
import SocketContext from './SocketContext';
import Scoreboard from './Scoreboard';
import Chat from './chat/Chat';
import Canvas from './canvas/Canvas';
import WordsModal from './WordsModal';
import './App.scss';
import defaultWords from './assets/words/default.txt';
import WordToGuess from './WordToGuess';
import Timer from './Timer';

export default class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingWordsModal: false,
      wordOptions: [],
      currentWord: '',
      roundInProgress: false,
      userRole: '',
      seconds: 91,
    };
  }

  componentDidMount() {
    this.props.socket.on('newWordIsUp', (word) => {
      this.setState({
        userRole: 'guesser',
        currentWord: word,
      });
    });
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
    this.setState({
      wordOptions,
      roundInProgress: true,
    });
  }

  handleWordSelect = (word) => {
    this.setState({
      currentWord: word,
      userRole: 'drawer',
      seconds: 90,
    });

    this.props.socket.emit('newWordToGuess', word);
    this.hideWordsModal();
    this.startCountDown();
  }

  startCountDown = () => {
    this.setState({
      intervalHandle: setInterval(this.tick, 1000),
    });
  }

  tick = () => {
    this.setState(prevState => ({ seconds: prevState.seconds - 1 }));

    if (this.state.seconds === 0) {
      clearInterval(this.state.intervalHandle);
    }
  }

  render() {
    return (
      <div className="wrapper">
        <WordsModal
          showing={this.state.showingWordsModal}
          handleClose={this.hideWordsModal}
          words={this.state.wordOptions}
          onSelectWord={this.handleWordSelect}
        />
        <button className={this.state.roundInProgress ? 'start-btn hidden' : 'start-btn'} type="button" onClick={this.startRound}>G O !</button>
        <Scoreboard players={this.props.players} />
        <div className="middle">
          <div className="title-and-word-container">
            <span>P I X I T</span>
            <div className="round-info">
              <WordToGuess word={this.state.currentWord} userRole={this.state.userRole} />
              <Timer seconds={this.state.seconds} />
            </div>
          </div>
          <SocketContext.Consumer>
            {socket => <Canvas socket={socket} />}
          </SocketContext.Consumer>
        </div>
        <Chat
          name={this.props.currentUser}
          messages={this.props.messages}
          updateMessage={this.props.sendMessage}
        />
      </div>
    );
  }
}
