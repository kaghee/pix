import React, { Component } from 'react';
import SocketContext from './SocketContext';
import Scoreboard from './Scoreboard';
import Chat from './chat/Chat';
import Canvas from './canvas/Canvas';
import WordsModal from './modals/WordsModal';
import RoundOverModal from './modals/RoundOverModal';
import './App.scss';
import defaultWords from './assets/words/default.txt';
import WordToGuess from './WordToGuess';
import Timer from './Timer';

export default class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingWordsModal: false,
      showingRoundOverModal: false,
      wordOptions: [],
      currentWord: '',
      roundInProgress: false,
      userRole: '',
      seconds: 90,
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
    const random = Math.floor(Math.random() * words.length);
    return words.slice(random, random + 1)[0];
  }

  openWordsModal = () => {
    this.setState({ showingWordsModal: true });
  }

  hideWordsModal = () => {
    this.setState({ showingWordsModal: false });
  }

  openRoundOverModal = () => {
    this.setState({ showingRoundOverModal: true });
  }

  hideRoundOverModal = () => {
    this.setState({ showingRoundOverModal: false });
  }

  startRound = () => {
    this.hideRoundOverModal();
    this.openWordsModal();
    const wordOptions = [this.getRandomWord(), this.getRandomWord(), this.getRandomWord()];
    this.setState({
      wordOptions,
    });
  }

  endRound = () => {
    this.openRoundOverModal();
    this.setState({
      roundInProgress: false,
    });
  }

  handleWordSelect = (word) => {
    this.setState({
      currentWord: word,
      userRole: 'drawer',
      seconds: 90,
      roundInProgress: true,
    });

    this.props.socket.emit('newWordToGuess', word);
    this.props.socket.emit('startCountDown');
    this.hideWordsModal();
  }

  render() {
    return (
      <div className="wrapper">
        <button className={this.state.roundInProgress ? 'start-btn hidden' : 'start-btn'} type="button" onClick={this.startRound}>G O !</button>
        <Scoreboard players={this.props.players} />
        <div className="middle">
          <div className="title-and-word-container">
            <span>P I X I T</span>
            <div className="round-info">
              <WordToGuess word={this.state.currentWord} userRole={this.state.userRole} />
              <SocketContext.Consumer>
                {socket => (
                  <Timer
                    seconds={this.state.seconds}
                    roundInProgress={this.state.roundInProgress}
                    endCountDown={this.endRound}
                    socket={socket}
                  />
                )}
              </SocketContext.Consumer>
            </div>
          </div>
          <div className="canvas-wrapper">
            <WordsModal
              showing={this.state.showingWordsModal}
              handleClose={this.hideWordsModal}
              words={this.state.wordOptions}
              onSelectWord={this.handleWordSelect}
            />
            <RoundOverModal
              showing={this.state.showingRoundOverModal}
              word={this.state.currentWord}
            />
            <SocketContext.Consumer>
              {socket => <Canvas socket={socket} />}
            </SocketContext.Consumer>
          </div>
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
