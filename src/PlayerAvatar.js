import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/StartScreens.scss';
import avatars from './assets/avatars';

const icons = avatars();

export default class PlayerAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIconIndex: Math.floor(Math.random() * icons.length),
    };
  }

  increment = () => {
    this.setState(prevState => ({ currentIconIndex: prevState.currentIconIndex + 1 }));
    this.props.onIconChange(icons[this.state.currentIconIndex + 1]);
  }

  decrement = () => {
    this.setState(prevState => ({ currentIconIndex: prevState.currentIconIndex - 1 }));
    this.props.onIconChange(icons[this.state.currentIconIndex - 1]);
  }

  getPreviousIcon = () => {
    if (this.state.currentIconIndex > 0) {
      this.decrement();
    } else {
      this.setState({
        currentIconIndex: icons.length - 1,
      });
    }
    this.props.onIconChange(icons[icons.length - 1]);
  }

  getNextIcon = () => {
    if (this.state.currentIconIndex < icons.length - 1) {
      this.increment();
    } else {
      this.setState({
        currentIconIndex: 0,
      });
      this.props.onIconChange(icons[0]);
    }
  }

  render() {
    return (
      <div className="icon-picker">
        <FontAwesomeIcon className="arrow" icon="chevron-left" onClick={this.getPreviousIcon} />
        <FontAwesomeIcon className="icon" icon={icons[this.state.currentIconIndex]} />
        <FontAwesomeIcon className="arrow" icon="chevron-right" onClick={this.getNextIcon} />
      </div>
    );
  }
}
