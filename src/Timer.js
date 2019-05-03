import React from 'react';

const Timer = props => (
  <div className={props.seconds > 90 ? 'timer hidden' : 'timer visible'}>
    <span>{props.seconds}</span>
  </div>
);

export default Timer;
