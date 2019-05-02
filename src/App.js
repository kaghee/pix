import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import io from 'socket.io-client';
import SocketContext from './SocketContext';
import GameScreen from './GameScreen';
import StartScreen from './StartScreen';
import './App.scss';

const socket = io('http://localhost:4000');

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

  componentWillUnmount = () => {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      this.state.currentUser.leaveRoom({ roomId })
        .then((room) => {
          console.log(`Left room with ID: ${room.id}`);
        })
        .catch((err) => {
          console.log('Error leaving room', err);
        });
    });
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
      const { players } = this.state;
      players.push(currentUser);
      this.setState({
        currentUser,
        players,
      });
      currentUser.subscribeToRoomMultipart({
        roomId,
        hooks: {
          onMessage: (message) => {
            const { messages } = this.state;
            messages.push(message);
            this.setState({ messages });
          },
          onUserJoined: (user) => {
            const playersUpdated = this.state.players;
            playersUpdated.push(user);
            this.setState({ players: playersUpdated });
          },
          onUserLeft: (user) => {
            console.log(`user ${user} left`);
            const allPlayers = this.state.players;
            for (let i = 0; i < allPlayers.length; i += 1) {
              if (allPlayers[i] === user) {
                allPlayers.splice(i, 1);
              }
            }
            this.setState({ players: allPlayers });
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
            <SocketContext.Provider value={socket}>
              <GameScreen
                {...props}
                user={this.state.username}
                players={this.state.players}
                message={this.state.message}
                messages={this.state.messages}
                updateMessage={this.updateMessage}
                sendMessage={this.sendMessage}
                socket={socket}
              />
            </SocketContext.Provider>
          )}
        />
      </div>
    );
  }
}
