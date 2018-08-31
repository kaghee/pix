import React, { Component } from 'react';

export class Brush extends Component {
  handleBrushClick = (e) => {
    this.props.onClick(e);
  }

  render() {
    return (
      <div className={this.props.className} onClick={(e) => this.handleBrushClick(e)} />
    );
  }
}