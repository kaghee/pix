import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LandingPageContainer from '../pages/LandingPageContainer';
import LobbyContainer from '../pages/Lobby';
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

  render() {
    return (
      <div>
        <Route
          exact
          path="/"
          render={props => (
            <LandingPageContainer
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/lobby"
          render={props => (
            <LobbyContainer
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
