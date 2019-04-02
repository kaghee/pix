import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import { Game } from './Game';
import { StartScreen } from './StartScreen';
import './App.scss';

const instanceLocator = "v1:us1:aecdc8b8-e7df-41c8-b3d1-c141e957ce9e";

const instanceId = "aecdc8b8-e7df-41c8-b3d1-c141e957ce9e";
const roomId = "20051968";
const chatServer = `http://localhost:4000`;

const tokenProvider = new TokenProvider({
  url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/${instanceId}/token`
});

let token = "";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScreen: "login",
      username: null,
      currentUser: null,
      chatWithUser: null,
      message: "",
      messages: [],
      chatWithUserIsTyping: false,
      refreshing: false,
      inChatRoom: false
    };
    // this.roomId = null;
    // this.chatWithUser = null;
  }

  loginWithUser = (username) => {
    this.setState({
      username
    });
    this.enterChat(username);
  }

  enterChat = (username) => {
    fetch(`${chatServer}/users`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username
      })
    })

    const chatManager = new ChatManager({
      tokenProvider,
      instanceLocator,
      userId: username
    });

    chatManager.connect().then(currentUser => {
      console.log('Successful connection', currentUser);
      currentUser.joinRoom({ roomId }).then(room => {
        console.log(`Joined room with ID: ${room.id}`)
      })
      .catch(err => {
        console.log(`Error joining room ${someRoomID}: ${err}`)
      })
    })
    .catch(err => {
      console.log('Error on connection', err);
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
        roomId
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

    messages.push({
      key: 9999,
      username: this.state.currentUser,
      msg: message,
      datetime: message.createdAt,
      isCurrentUser: true
    });
    console.log({messages});

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
