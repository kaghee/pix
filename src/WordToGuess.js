import React, { Component } from 'react';

export default class WordToGuess extends Component {
  render() {
    const dummy = this.props.word.split('').map(() => '_');
    const wordToDisplay = this.props.userRole === 'drawer' ? this.props.word : dummy;

    console.log(this.props.roundInProgress);
    return (
      <div className="current-word">
        {this.props.roundInProgress ? wordToDisplay : ''}
      </div>
    );
  }
}
