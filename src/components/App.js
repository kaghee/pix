import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LandingPageContainer from '../pages/LandingPageContainer';
import Lobby from '../pages/Lobby';
import GameScreen from '../pages/GameScreen';
import './App.scss';

export default class App extends Component {
  componentDidMount() {
    window.addEventListener('load', this.redirectToLandingPage);
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.redirectToLandingPage);
  }

  redirectToLandingPage = () => {
    if (window.location.pathname !== '/') {
      window.location.replace('/');
    }
  }

  createRoom = (name) => {
    console.log(name);
  }

  render() {
    return (
      <div>
        <Route
          exact
          path="/"
          render={props => (
            <LandingPageContainer
              {...props}
              createRoom={this.createRoom}
            />
          )}
        />
        <Route
          exact
          path="/lobby"
          render={props => (
            <Lobby
              {...props}
            />
          )}
        />
        <Route
          path="/play"
          render={props => (
            <GameScreen
              {...props}
            />
          )}
        />
      </div>
    );
  }
}
