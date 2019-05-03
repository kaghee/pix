// import React from 'react';
//
// const Timer = props => (
//   <div className={props.seconds > 90 ? 'timer hidden' : 'timer visible'}>
//     <span>{props.seconds}</span>
//   </div>
// );
//
// export default Timer;


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
    }
  }

  render() {
    return (
      <div className={this.state.seconds > 90 ? 'timer hidden' : 'timer visible'}>
        <span>{this.state.seconds}</span>
      </div>
    );
  }
}
