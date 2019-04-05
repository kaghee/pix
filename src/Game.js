import React, { Component } from 'react';
import Scoreboard from './Scoreboard';
import Chat from './chat/Chat';
import Canvas from './canvas/Canvas';
import Palette from './canvas/Palette';
import Presets from './canvas/Presets';
import './App.scss';

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colour: [0, 0, 0],
      preset: 1,
      tool: 'brush',
    };
  }

  changeColour = (newColour) => {
    this.setState({
      colour: newColour,
    });
  }

  changePreset = (newPreset) => {
    this.setState({
      preset: newPreset,
    });
  }

  changeTool = (newTool) => {
    this.setState({
      tool: newTool,
    });
  }

  render() {
    return (
      <div className="wrapper">
        <Scoreboard players={this.props.players} />
        <div className="middle">
          <div className="title">P I X I T</div>
          <Canvas colour={this.state.colour} preset={this.state.preset} onToolChange={this.changeTool} />
          <div className="palette-and-presets-toolbar">
            <Palette onColourChange={this.changeColour} tool={this.state.tool} />
            <Presets onPresetChange={this.changePreset} />
          </div>
        </div>
        <Chat
          name={this.props.user}
          messages={this.props.messages}
          updateMessage={this.props.sendMessage}
        />
      </div>
    );
  }
}
