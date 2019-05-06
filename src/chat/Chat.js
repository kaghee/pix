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

  handleCorrectGuess = () => {
    this.setState({
      canGuess: false,
    });
    this.props.socket.emit('incomingCorrectGuess', this.props.name);
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
          onCorrectGuess={this.handleCorrectGuess}
        />
      </div>
    );
  }
}
