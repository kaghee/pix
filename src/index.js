import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import App from './App';
import { StartScreen } from './StartScreen';


ReactDOM.render((
  <BrowserRouter>
    <div>
      

      <Route exact path='/' component={StartScreen} />
      <Route path='/play' component={App} />
    </div>
  </BrowserRouter>
), document.getElementById('root'));
