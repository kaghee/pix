import React, { Component } from 'react';
import { MessageList } from './MessageList';
import { SendMessageForm } from './SendMessageForm';

export class Chat extends Component {
  constructor() {
    super()
    this.state = {
      messages: []
    }
  }

  render() {
    return (
      <div className="chat">
        <MessageList messages={this.props.messages} />
        <SendMessageForm sendMessage={this.props.updateMessage} />
      </div>
    )
  }
}
  // sendMessage = (text) => {
  //   this.props.name.sendMessage({
  //     text,
  //     roomId: roomId
  //   })
  // }
