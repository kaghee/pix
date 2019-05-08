import React, { Component } from 'react';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canGuess: true,
    };
  }

  componentDidMount() {
    this.props.socket.on('endRound', () => {
      this.setState({
        canGuess: true,
      });
    });
  }

  handleGuess = (guess) => {
    this.props.socket.emit('incomingGuess', this.props.name, guess);
  }

  render() {
    return (
      <div className="chat">
        <MessageList messages={this.props.messages} />
        <SendMessageForm
          sendMessage={this.props.updateMessage}
          name={this.props.name}
          wordToGuess={this.props.wordToGuess}
          canGuess={this.state.canGuess}
          onGuess={this.handleGuess}
        />
      </div>
    );
  }
}
