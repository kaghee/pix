import React, { Component } from 'react';
import { ChatApp } from './chat/ChatApp';
import { Canvas } from './canvas/Canvas';
import { Palette } from './canvas/Palette';
import { Presets } from './canvas/Presets';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colour: [0, 0, 0],
      preset: 1,
      tool: "brush"
    }
  }

  changeColour = (newColour) => {
    this.setState({
      colour: newColour
    });
  }

  changePreset = (newPreset) => {
    this.setState({
      preset: newPreset
    });
  }

  changeTool = (newTool) => {
    this.setState({
      tool: newTool
    });
  }

  render() {
    return (
      <div className="wrapper">
        <div className="header logo-es-segitseg"></div>
        <div className="container">
          <div className="scoreboard"></div>
          <div className="drawing">
            <Canvas colour={this.state.colour} preset={this.state.preset} onToolChange={this.changeTool}/>
            <div className="toolbar brush">
              <Palette onColourChange={this.changeColour} tool={this.state.tool} />
              <Presets onPresetChange={this.changePreset} />
            </div>
          </div>
          <ChatApp />
        </div>
      </div>
    );
  }
}

export default App;
