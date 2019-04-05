import React, { Component } from 'react';

export default class Resetter extends Component {
  handleResetClick = () => {
    this.props.onClick();
  }

  render() {
    return (
      <div
        className="resetter tool"
        onClick={() => {}}
        onKeyPress={this.handleResetClick}
        role="button"
        tabIndex={0}
      />
    );
  }
}
