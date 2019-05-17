import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import io from 'socket.io-client';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUserAstronaut, faUserNinja, faUserSecret, faUserGraduate,
  faUserTie, faUserMd, faUserNurse, faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import SocketContext from './SocketContext';
import GameScreen from './GameScreen';
import StartScreen from './StartScreen';
import CreateRoomScreen from './CreateRoomScreen';
import './css/App.scss';

const socket = io('http://localhost:4000');

const instanceLocator = 'v1:us1:aecdc8b8-e7df-41c8-b3d1-c141e957ce9e';
const instanceId = 'aecdc8b8-e7df-41c8-b3d1-c141e957ce9e';
const chatServer = 'http://localhost:4000';
const tokenProvider = new TokenProvider({
  url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/${instanceId}/token`,
});

const token = '';

library.add(faUserAstronaut);
library.add(faUserNinja);
library.add(faUserSecret);
library.add(faUserTie);
library.add(faUserMd);
library.add(faUserNurse);
library.add(faUserGraduate);
library.add(faChevronLeft);
library.add(faChevronRight);

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
      currentlyCreatedRoomId: '',
      isCurrentUserOwner: false,
    };
  }

  componentDidMount = () => {
    // for deleting user upon leaving the page
    window.addEventListener('beforeunload', () => {
      socket.emit('userLeave', this.state.currentUser.id);
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

  enterChat = (username, icon, roomToJoin) => {
    console.log({icon});
    this.setState({
      username,
      roomName: roomToJoin,
    });
    const owner = roomToJoin === 'newRoom';
    if (owner) {
      this.setState({
        isCurrentUserOwner: true,
      });
    }
    this.createUser(username, owner, icon);
    this.connectToChat(username, roomToJoin);
  }

  createUser = (username, owner, icon) => {
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
        owner,
        icon,
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

      let roomId = '';

      if (roomToJoin && roomToJoin !== 'newRoom') {
        currentUser.getJoinableRooms().then((rooms) => {
          if (roomToJoin !== 'random') {
            roomId = rooms.find(rm => rm.name === roomToJoin).id;
          } else {
            roomId = rooms[Math.floor(Math.random() * rooms.length)].id;
          }
          currentUser.subscribeToRoomMultipart({
            roomId,
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
                socket.emit('userJoined', newUser, roomId);
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
            this.setState({
              players: room.users,
            });
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
        });
      } else {
        // Creating a new room
        currentUser.createRoom({
          name: this.state.roomName,
        }).then((room) => {
          console.log(`Created room called ${room.name}`, room.id);
          const { rooms } = this.state;
          rooms.push(room.id);
          this.setState({
            rooms,
            currentlyCreatedRoomId: room.id,
          });
          currentUser.subscribeToRoomMultipart({
            roomId: this.state.currentlyCreatedRoomId,
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
                socket.emit('userJoined', newUser, roomId);
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
          });
          this.state.currentUser.fetchMultipartMessages({
            roomId: this.state.currentlyCreatedRoomId,
            direction: 'older',
            limit: 1,
          }).then((messages) => {
            this.setState({
              messages: messages.slice(0, messages.length - 1),
            });
          });
        }).catch((err) => {
          console.log(`Error creating room ${err}`);
        });
      }
    }).catch((err) => {
      console.log('Error on connection', err);
      alert('An error occurred while trying to connect. Please refresh the page and try again.');
    });
  }

  render() {
    return (
      <div>
        <Route
          exact
          path="/"
          render={props => (
            <SocketContext.Provider value={socket}>
              <StartScreen
                {...props}
                enterChat={this.enterChat}
                createRoom={this.handleCreateRoom}
                rooms={this.state.rooms}
                socket={socket}
              />
            </SocketContext.Provider>
          )}
        />
        <Route
          exact
          path="/create"
          render={props => (
            <SocketContext.Provider value={socket}>
              <CreateRoomScreen
                {...props}
                name={this.state.username}
                roomName={this.state.roomName}
                enterChat={this.enterChat}
                players={this.state.players}
                isCurrentUserOwner={this.state.isCurrentUserOwner}
                socket={socket}
              />
            </SocketContext.Provider>
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
