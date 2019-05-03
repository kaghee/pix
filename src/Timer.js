import React, { Component } from 'react';

export default class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seconds: this.props.seconds,
    };
  }

  componentDidMount() {
    this.props.socket.on('startCountDown', () => {
      this.startCountDown();
    });
  }

  startCountDown = () => {
    this.setState({
      intervalHandle: setInterval(this.tick, 1000),
    });
  }

  tick = () => {
    this.setState(prevState => ({ seconds: prevState.seconds - 1 }));

    if (this.state.seconds === 0) {
      clearInterval(this.state.intervalHandle);
      this.props.endCountDown();
    }
  }

  render() {
    return (
      <div className={this.props.roundInProgress ? 'timer visible' : 'timer hidden'}>
        <span>{this.state.seconds}</span>
      </div>
    );
  }
}
