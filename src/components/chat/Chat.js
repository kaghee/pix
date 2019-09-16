import React, { Component } from 'react';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';

export default class Chat extends Component {
  handleGuess = (guess) => {
    this.props.socket.emit('incomingGuess', this.props.name, guess);
  }

  render() {
    return (
      <div className="chat">
        <MessageList messages={this.props.messages} />
        <SendMessageForm
          onGuess={this.handleGuess}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}
