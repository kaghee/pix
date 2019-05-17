import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/StartScreens.scss';

const icons = ['user-astronaut', 'user-ninja', 'user-secret', 'user-tie', 'user-md', 'user-nurse'];

export default class PlayerAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIconIndex: this.props.player.customData.userIndex % icons.length,
    };
  }

  increment = () => {
    this.setState(prevState => ({ currentIconIndex: prevState.currentIconIndex + 1 }));
  }

  decrement = () => {
    this.setState(prevState => ({ currentIconIndex: prevState.currentIconIndex - 1 }));
  }

  getPreviousIcon = () => {
    if (this.state.currentIconIndex > 0) {
      this.decrement();
    } else {
      this.setState({
        currentIconIndex: icons.length - 1,
      });
    }
  }

  getNextIcon = () => {
    if (this.state.currentIconIndex < icons.length - 1) {
      this.increment();
    } else {
      this.setState({
        currentIconIndex: 0,
      });
    }
  }

  render() {
    return (
      <div className="player-avatar">
        <div className="icon-picker">
          <FontAwesomeIcon className="arrow left" icon="chevron-left" onClick={this.getPreviousIcon} />
          <FontAwesomeIcon className="icon" icon={icons[this.state.currentIconIndex]} />
          <FontAwesomeIcon className="arrow right" icon="chevron-right" onClick={this.getNextIcon} />
        </div>
        <span>{this.props.player.name}</span>
      </div>
    );
  }
}
