import React, { Component } from 'react';

export default class WordToGuess extends Component {
  render() {
    console.log(this.props.word);
    const dummy = this.props.word.split('').map(() => '_');
    const wordToDisplay = this.props.userRole === 'drawer' ? this.props.word : dummy;

    return (
      <div className="current-word">
        {wordToDisplay}
      </div>
    );
  }
}
