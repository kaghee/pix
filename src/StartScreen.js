import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

export class StartScreen extends Component {
  render() {
    return (
      <div className="wrapper">
        <div className="start-box">
          <div className="start-form">
            <input type="text" className="name" placeholder="Enter your name" />
            <div className="rounds">
              <label>Rounds:</label>
              <select>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10" selected>10</option>
              </select>
            </div>
          </div>
          <div className="play-button-area">
            <Link to="/play">
              <button className="btn play">Play!</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}