import React from 'react';

function MessageList(props) {
  return (
    <ul className="message-list">
      {props.messages.map(message => (
        <li key={message.id} className="message">
          <span className="sender">{message.senderId}</span>: <span className="text">{message.parts[0].payload.content}</span>
        </li>
      ))}
    </ul>
  );
}

export default MessageList;
