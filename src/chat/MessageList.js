import React from 'react';

function MessageList(props) {
  const messagesToDisplay = props.messages.map((message) => {
    if (message.parts[0].payload.content.includes('SYSTEM ')) {
      return (
        <li key={message.id} className="message winner">
          <span className="text">{`${message.senderId} has guessed the word!`}</span>
        </li>
      );
    }
    return (
      <li key={message.id} className="message">
        <span className="sender">{message.senderId}</span>: <span className="text">{message.parts[0].payload.content}</span>
      </li>
    );
  });

  return (
    <ul className="message-list">
      {messagesToDisplay}
    </ul>
  );
}

export default MessageList;
