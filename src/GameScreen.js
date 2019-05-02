import React from 'react';
import SocketContext from './SocketContext';
import Scoreboard from './Scoreboard';
import Chat from './chat/Chat';
import Canvas from './canvas/Canvas';
import './App.scss';

function GameScreen(props) {
  return (
    <div className="wrapper">
      <Scoreboard players={props.players} />
      <div className="middle">
        <div className="title">P I X I T</div>
        <SocketContext.Consumer>
          {socket => <Canvas socket={socket} />}
        </SocketContext.Consumer>
      </div>
      <Chat
        name={props.user}
        messages={props.messages}
        updateMessage={props.sendMessage}
      />
    </div>
  );
}

export default GameScreen;
