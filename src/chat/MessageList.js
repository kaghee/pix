import React, { Component } from 'react';

export class MessageList extends Component {
  render() {
    return (
      <ul className="message-list">
        {this.props.messages.map((message) => {
          return (
            <li key={message.id} className="message">
              <span className="sender">{message.senderId}</span>: <span className="text">{message.parts[0].payload.content}</span>
            </li>
          );
        })}
      </ul>
    )
  }
}
