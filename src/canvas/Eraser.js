import React, { Component } from 'react';

export class Eraser extends Component {
  handleEraserClick = (e) => {
    this.props.onClick(e);
  }

  render() {
    return (
      <div className={this.props.className} onClick={(e) => this.handleEraserClick(e)} />
    );
  }
}