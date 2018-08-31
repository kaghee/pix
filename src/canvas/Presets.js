import React, { Component } from 'react';

export class Presets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPreset: 1,
    }

    this.handlePresetChange = this.handlePresetChange.bind(this);
  }

  handlePresetChange(newPreset) {
    this.props.onPresetChange(newPreset);
  }

  setPreset(i) {
    const presets = [1, 2, 3, 4];
    const preset = presets[i - 1];
    this.setState({ currentPreset: preset });
    this.handlePresetChange(preset);
  }

  render() {
    const presets = [];

    for (let i = 1; i <= 4; i++) {
      presets.push(
        <div
          key={`pr${i}`}
          className="preset btn"
          onClick={() => this.setPreset(i)}
        >
          <div className={`pr${i}`} />
        </div>
      );
    }

    return (
      <div className="presets">
        {presets}
      </div>
    );
  }
}
