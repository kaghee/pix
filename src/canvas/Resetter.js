import React, { Component } from 'react';

export class Resetter extends Component {

  handleResetClick = () => {
    this.props.onClick();
  }

  render() {
    return (
      <div className="resetter tool" onClick={this.handleResetClick} />
    );
  }
}