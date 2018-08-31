import React, { Component } from 'react';
import { MessageList } from './MessageList';
import { SendMessageForm } from './SendMessageForm';
import Chatkit from '@pusher/chatkit';

const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/6dd5be3c-e1dd-4fbe-a480-3687412cb28a/token";
const instanceLocator = "v1:us1:6dd5be3c-e1dd-4fbe-a480-3687412cb28a";
const roomId = 13386972;
const username = 'malac';

export class ChatApp extends Component {
  constructor() {
    super()
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: username,
      tokenProvider: new Chatkit.TokenProvider({
        url: testToken
      })
    });

    chatManager.connect().then(currentUser => {
      this.currentUser = currentUser;
      currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
          onNewMessage: message => {
            this.setState({
              messages: [...this.state.messages, message]
            })
          }
        }
      })
    })
  }

  sendMessage = (text) => {
    this.currentUser.sendMessage({
      text,
      roomId: roomId
    })
  }

  render() {
    return (
      <div className="chat">
        <MessageList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage}/>
      </div>
    )
  }
}
