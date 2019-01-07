import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { ChatManager, TokenProvider } from "@pusher/chatkit";
import { Game } from './Game';
import { StartScreen } from './StartScreen';
import './App.scss';

const instanceLocator = "v1:us1:6dd5be3c-e1dd-4fbe-a480-3687412cb28a";
const instanceId = "6dd5be3c-e1dd-4fbe-a480-3687412cb28a";
const roomId = 13386972;
const chatServer = "http://localhost:4000/users";

const tokenProvider = new TokenProvider({
  url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/${instanceId}/token`
});

export default class App extends Component {
  state = {
    currentScreen: "login",
    username: null,
    roomId: null,
    chatWithUser: null,
    message: "",
    messages: [],
    chatWithUserIsTyping: false,
    refreshing: false,
    inChatRoom: false
  };
  constructor(props) {
    super(props);

    this.currentUser = null;
    this.roomId = null;
    this.chatWithUser = null;
   
  }

  loginWithUser = (username) => {
    this.setState({
      username
    });
    this.enterChat(username);
  }

  enterChat = (username) => {
    fetch(chatServer, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username
      })
    }).then(() => {
      this.chatManager = new ChatManager({
        instanceLocator,
        userId: username,
        tokenProvider
      });

      this.chatManager.connect().then((currentUser) => {
        this.currentUser = currentUser;

        this.setState({
          roomId
        });

        currentUser.subscribeToRoom({
          roomId: roomId,
          hooks: {
            onNewMessage: this.onReceiveMessage
          }
        });
      })
    })
  }

  onReceiveMessage = (message) => {
    let isCurrentUser = this.currentUser.id == message.sender.id ? true : false;

    let messages = [...this.state.messages];
    messages.push({
      key: message.id.toString(),
      username: message.sender.name,
      msg: message.text,
      datetime: message.createdAt,
      isCurrentUser
    });

    this.setState({
      messages
    });
  }

  sendMessage = () => {
    if (this.state.message) {
      this.currentUser.sendMessage({
        text: this.state.message,
        roomId: this.state.currentRoomId
      }).then((messageId) => {
        this.setState({
          message: ""
        });
      })
      .catch(err => {
        console.log(`error adding message to room: ${err}`);
      });
    }
  };

  updateMessage = (message) => {
    console.log(message);
    this.setState({
      message
    });
    const messages = [...this.state.messages];
    
    // messages.push({
    //   key: 9999,
    //   username: this.currentUser,
    //   msg: message,
    //   datetime: message.createdAt,
    //   isCurrentUser: true
    // });
    
    this.setState({ messages });
  };

  render() {
    return (
      <div>
        <Route exact path='/' render={(props) =>
          <StartScreen {...props} onNameChange={this.loginWithUser} />}
        />
        <Route path='/play' render={(props) =>
          <Game {...props}
            user={this.state.username}
            message={this.state.message}
            messages={this.state.messages}
            updateMessage={this.updateMessage}
            sendMessage={this.sendMessage}
          />}
        />
      </div>
    )
  }
}
