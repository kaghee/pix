import React from 'react';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';

function Chat(props) {
  return (
    <div className="chat">
      <MessageList messages={props.messages} />
      <SendMessageForm sendMessage={props.updateMessage} />
    </div>
  );
}

export default Chat;
