import React, { Component } from 'react';

export class MessageList extends Component {
  render() {
    return (
      <ul className="message-list">
        {this.props.messages.map((message) => {
          return (
            <li key={message.key} className="message">
              <span className="sender">{message.username}</span>: <span className="text">{message.msg}</span>
            </li>
          );
        })}
      </ul>
    )
  }
}
