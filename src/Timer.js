import React, { Component } from 'react';

export default class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seconds: 80,
      countDown: false,
    };
  }

  componentDidMount() {
    this.props.socket.on('startCountDown', () => {
      this.startCountDown();
      this.setState({
        countDown: true,
      });
    });

    this.props.socket.on('resetCountDown', () => {
      this.setState({
        countDown: false,
        seconds: 0,
      });
    });
  }

  startCountDown = () => {
    this.setState({
      seconds: 80,
      intervalHandle: setInterval(this.tick, 1000),
    });
  }

  tick = () => {
    this.setState(prevState => ({ seconds: prevState.seconds - 1 }));

    if (this.state.seconds === 45 || this.state.seconds === 30 || this.state.seconds === 15) {
      this.props.giveAHint();
    }

    if (this.state.seconds === 0) {
      clearInterval(this.state.intervalHandle);
      this.props.endCountDown('timeIsUp');
    }
  }

  render() {
    return (
      <div className={this.state.countDown ? 'timer visible' : 'timer hidden'}>
        <span>{this.state.seconds}</span>
      </div>
    );
  }
}
