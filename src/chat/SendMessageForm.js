import React, { Component } from 'react';

export default class SendMessageForm extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      message: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onGuess(this.state.message);
    this.setState({
      message: '',
    });
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="send-message-form"
      >
        <input
          onChange={this.handleChange}
          value={this.state.message}
          placeholder="Type your guess here..."
          type="text"
          disabled={!this.props.canGuess}
        />
      </form>
    );
  }
}
