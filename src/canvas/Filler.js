import React, { Component } from 'react';

export default class Filler extends Component {
  handleFillerClick = (e) => {
    this.props.onClick(e);
  }

  render() {
    return (
      <div
        className={this.props.className}
        style={{ backgroundColor: this.props.colour }}
        onClick={e => this.handleFillerClick(e)}
        onKeyPress={e => this.handleFillerClick(e)}
        role="button"
        tabIndex={0}
      />
    );
  }
}
