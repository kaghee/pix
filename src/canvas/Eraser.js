import React, { Component } from 'react';

export default class Eraser extends Component {
  handleEraserClick = (e) => {
    this.props.onClick(e);
  }

  render() {
    return (
      <div
        className={this.props.className}
        onClick={() => {}}
        onKeyPress={e => this.handleEraserClick(e)}
        role="button"
        tabIndex={0}
      />
    );
  }
}
