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
    console.log(this.props.disabled);
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
