import React from 'react';

function MessageList(props) {
  const messagesToDisplay = props.messages.map((message) => {
    const messageText = message.parts[0].payload.content;
    if (messageText.includes('SYSTEM correct guess')) {
      return (
        <li key={message.id} className="message winner">
          <span className="text">{`${message.senderId} has guessed the word!`}</span>
        </li>
      );
    }
    if (messageText.includes('SYSTEM user left')) {
      return (
        <li key={message.id} className="message leaver">
          <span className="text">{`${message.senderId} has left.`}</span>
        </li>
      );
    }
    return (
      <li key={message.id} className="message">
        <span className="sender">
          {message.senderId}
        </span>
        :
        {' '}
        <span className="text">{messageText}</span>
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
