import React, { Component } from 'react';
import SocketContext from './SocketContext';
import Scoreboard from './Scoreboard';
import Chat from './chat/Chat';
import Canvas from './canvas/Canvas';
import WordsModal from './modals/WordsModal';
import RoundOverModal from './modals/RoundOverModal';
import './css/App.scss';
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
      userChoosing: '',
      canDraw: false,
      drawersWord: '',
      wordWas: '',
      finishedPlayers: [],
    };
  }

  componentDidMount() {
    this.props.socket.on('newWordIsUp', (dummy) => {
      this.hideRoundOverModal();
      this.hideWordsModal();
      this.setState({
        userRole: 'guesser',
        currentWord: dummy,
        roundInProgress: true,
      });
    });

    this.props.socket.on('userChoosingWord', (user) => {
      this.hideRoundOverModal();
      this.openWordsModal();
      this.setState({
        userChoosing: user,
      });
    });

    this.props.socket.on('endRound', (word) => {
      this.setState({
        wordWas: word,
      });
    });

    this.props.socket.on('userFinishedRound', (user) => {
      const { finishedPlayers } = this.state;
      finishedPlayers.push(user);
      this.setState({
        finishedPlayers,
      });
      if (this.props.user === user) {
        this.setState({
          userRole: 'finished',
        });
      }
    });
  }

  getRandomWords = () => {
    const words = defaultWords.split('\n');
    const results = [];
    function getWord() {
      const random = Math.floor(Math.random() * words.length);
      return words.slice(random, random + 1)[0];
    }
    for (let i = 0; i < 3; i += 1) {
      const wordToAdd = getWord();
      if (!results.includes(wordToAdd)) {
        results.push(wordToAdd);
      }
    }
    return results;
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
    const wordOptions = this.getRandomWords();
    this.setState({
      wordOptions,
      userRole: 'drawer',
    });
    this.props.socket.emit('userChoosingWord', this.props.user);
  }

  endRound = () => {
    this.props.socket.emit('endRound');
    this.openRoundOverModal();
    this.setState({
      roundInProgress: false,
      userRole: 'guesser',
      canDraw: false,
    });
  }

  handleWordSelect = (word) => {
    this.setState({
      roundInProgress: true,
      canDraw: true,
      drawersWord: word,
    });

    this.props.socket.emit('resetCanvasForAll');
    this.props.socket.emit('newWordToGuess', word);
    this.props.socket.emit('startCountDown');
    this.hideWordsModal();
  }

  render() {
    return (
      <div className="wrapper">
        <button className={this.state.roundInProgress ? 'start-btn hidden' : 'start-btn'} type="button" onClick={this.startRound}>G O !</button>
        <Scoreboard players={this.props.players} finishedPlayers={this.state.finishedPlayers} />
        <div className="middle">
          <div className="title-and-word-container">
            <span>P I X I T</span>
            <div className="round-info">
              <WordToGuess
                word={this.state.currentWord}
                drawersWord={this.state.drawersWord}
                userRole={this.state.userRole}
                roundInProgress={this.state.roundInProgress}
              />
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
              userRole={this.state.userRole}
              userChoosing={this.state.userChoosing}
            />
            <RoundOverModal
              showing={this.state.showingRoundOverModal}
              word={this.state.wordWas}
            />
            <SocketContext.Consumer>
              {socket => <Canvas canDraw={this.state.canDraw} socket={socket} />}
            </SocketContext.Consumer>
          </div>
        </div>
        <SocketContext.Consumer>
          {socket => (
            <Chat
              name={this.props.user}
              messages={this.props.messages}
              updateMessage={this.props.sendMessage}
              wordToGuess={this.state.currentWord}
              disabled={this.state.userRole !== 'guesser'}
              socket={socket}
            />
          )
        }
        </SocketContext.Consumer>
      </div>
    );
  }
}
