import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import Game from './Game';
import StartScreen from './StartScreen';
import './App.scss';

const instanceLocator = 'v1:us1:aecdc8b8-e7df-41c8-b3d1-c141e957ce9e';

const instanceId = 'aecdc8b8-e7df-41c8-b3d1-c141e957ce9e';
const roomId = '20051968';
const chatServer = 'http://localhost:4000';

const tokenProvider = new TokenProvider({
  url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/${instanceId}/token`,
});

const token = '';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      players: [],
      currentUser: null,
      message: '',
      messages: [],
    };
  }

  enterChat = (username) => {
    this.setState({
      username,
    });
    this.createUser(username);
    this.connectToChat(username);
  }

  createUser = (username) => {
    fetch(`${chatServer}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
      }),
    });
  }

  connectToChat = (username) => {
    const chatManager = new ChatManager({
      tokenProvider,
      instanceLocator,
      userId: username,
    });

    chatManager.connect().then((currentUser) => {
      console.log('Successful connection', currentUser);
      const players = this.state.players;
      players.push(currentUser);
      this.setState({
        currentUser,
        players,
      });
      this.state.currentUser.subscribeToRoomMultipart({
        roomId,
        hooks: {
          onMessage: (message) => {
            const { messages } = this.state;
            messages.push(message);
            this.setState({ messages });
          },
        },
      }).then((room) => {
        console.log(`Joined room with ID: ${room.id}`);
        this.setState({ players: room.users });
        this.state.currentUser.fetchMultipartMessages({
          roomId,
          direction: 'older',
          limit: 1,
        }).then((messages) => {
          this.setState({
            messages: messages.slice(0, messages.length - 1),
          });
        });
      }).catch((err) => {
        console.log(`Error joining room: ${err}`);
      });
    }).catch((err) => {
      console.log('Error on connection', err);
    });
  }

  sendMessage = (message) => {
    this.state.currentUser.sendSimpleMessage({
      roomId,
      text: message,
    }).then(() => {
      this.setState({
        message: '',
      });
    }).catch((err) => {
      console.log(`error adding message to room: ${err}`);
    });
  };

  render() {
    return (
      <div>
        <Route
          exact
          path="/"
          render={props => (
            <StartScreen {...props} onNameChange={this.enterChat} />
          )}
        />
        <Route
          path="/play"
          render={props => (
            <Game
              {...props}
              user={this.state.username}
              players={this.state.players}
              message={this.state.message}
              messages={this.state.messages}
              updateMessage={this.updateMessage}
              sendMessage={this.sendMessage}
            />
          )}
        />
      </div>
    );
  }
}
