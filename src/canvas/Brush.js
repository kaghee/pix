import React, { Component } from 'react';

export default class Brush extends Component {
  handleBrushClick = (e) => {
    this.props.onClick(e);
  }

  render() {
    return (
      <div
        className={this.props.className}
        onClick={() => {}}
        onKeyPress={e => this.handleBrushClick(e)}
        role="button"
        tabIndex={0}
      />
    );
  }
}
