import React, { Component } from 'react';
import './Home.scss';

export default class StartScreen extends Component {
  submit = (e) => {
    e.preventDefault();
    const newName = e.target.querySelector('input').value;

    this.props.onNameChange(newName);

    this.props.history.push('/play');
  }

  render() {
    return (
      <div className="start-wrapper">
        <div className="start-box">
          <form onSubmit={e => this.submit(e)} className="start-form">
            <input type="text" className="name" placeholder="Enter your name" />
            <div className="rounds">
              <label>Rounds:</label>
              <select>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10" defaultValue>10</option>
              </select>
            </div>
            <div className="play-button-area">
              <input className="btn play" type="submit" value="Play!" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
