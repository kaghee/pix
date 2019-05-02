import React, { Component } from 'react';

export default class WordToGuess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWord: ''
    }
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.word !== prevProps.word) {
      this.setState({
        currentWord: this.props.word
      });
    }
  }

  render() {
    const dummy = this.state.currentWord.split("").map((letter) => "_");
    console.log(this.props.user, this.props.currentUser)
    const wordToDisplay = this.props.user === this.props.currentUser ? this.state.currentWord : dummy;
    
    return (
      <div className="current-word">
        {wordToDisplay}
      </div>
    )
  }
}
