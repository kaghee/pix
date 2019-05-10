import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import io from 'socket.io-client';
import SocketContext from './SocketContext';
import GameScreen from './GameScreen';
import StartScreen from './StartScreen';
import CreateRoomScreen from './CreateRoomScreen';
import './App.scss';

const socket = io('http://localhost:4000');

const instanceLocator = 'v1:us1:aecdc8b8-e7df-41c8-b3d1-c141e957ce9e';
const instanceId = 'aecdc8b8-e7df-41c8-b3d1-c141e957ce9e';
const defaultRoomId = '20051968';
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
      rooms: [],
      roomName: '',
    };
  }

  componentDidMount = () => {
    // for deleting user upon leaving the page
    window.addEventListener('beforeunload', () => {
      socket.emit('userLeave', this.state.currentUser.id, defaultRoomId);
    });

    socket.on('incomingIncorrectGuess', (user, word) => {
      this.sendMessage(user, word);
    });

    socket.on('userGuessedTheWord', (user) => {
      this.sendMessage(user, 'SYSTEM correct guess');
    });

    socket.on('userLeft', (user, dummyUser) => {
      this.sendMessage(dummyUser, 'SYSTEM user left');
    });

    socket.on('userJoin', (user) => {
      this.joinRoom(user, defaultRoomId);
    });

    socket.on('newRoom', (room) => {
      const { rooms } = this.state;
      rooms.push(room);
      this.setState({
        rooms,
      });
    });
  }

  handleCreateRoom = (username, roomName) => {
    this.setState({
      username,
      roomName,
    });
  }

  enterChat = (username, roomToJoin) => {
    this.setState({
      username,
    });
    this.createUser(username);
    this.connectToChat(username, roomToJoin);
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

  connectToChat = (username, roomToJoin) => {
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
      // const roomId = roomToJoin === 'default' ? defaultRoomId : roomToJoin;

      if (roomToJoin === 'default') {
        currentUser.subscribeToRoomMultipart({
          roomId: defaultRoomId,
          hooks: {
            onMessage: (message) => {
              const { messages } = this.state;
              messages.push(message);
              this.setState({ messages });
            },
            onUserJoined: (newUser) => {
              const playersUpdated = this.state.players;
              playersUpdated.push(newUser);
              this.setState({ players: playersUpdated });
            },
            onUserLeft: (exUser) => {
              socket.emit('userLeft', exUser.id);
              const allPlayers = this.state.players;
              for (let i = 0; i < allPlayers.length; i += 1) {
                if (allPlayers[i] === exUser) {
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
            roomId: room.id,
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
      } else {
        currentUser.createRoom({
          name: this.state.roomName,
          private: true,
          customData: { foo: 42 },
        }).then((room) => {
          console.log(`Created room called ${room.name}`, room.id);
          // socket.emit('roomCreated', room.id, room.name);
          const { rooms } = this.state;
          rooms.push(room.id);
          this.setState({
            rooms,
          });
        }).catch((err) => {
          console.log(`Error creating room ${err}`);
        });
      }
    }).catch((err) => {
      console.log('Error on connection', err);
    });
  }

  sendMessage = (user, message) => {
    this.state.currentUser.sendSimpleMessage({
      defaultRoomId,
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
            <StartScreen
              {...props}
              enterChat={this.enterChat}
              createRoom={this.handleCreateRoom}
              findRoom={this.findRoom}
              rooms={this.state.rooms}
            />
          )}
        />
        <Route
          exact
          path="/create"
          render={props => (
            <CreateRoomScreen
              {...props}
              name={this.state.username}
              roomName={this.state.roomName}
              enterChat={this.enterChat}
            />
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
