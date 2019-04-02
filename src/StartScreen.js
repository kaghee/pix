import React, { Component } from 'react';
import './Home.scss';
import Chatkit from '@pusher/chatkit-client';


export class StartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "d"
    }
  }

  submit = (e) => {
    e.preventDefault();
    const newName = e.target.querySelector('input').value;
    this.setState({
      username: newName
    })
    this.props.onNameChange(newName);



    // const instanceLocator = "6dd5be3c-e1dd-4fbe-a480-3687412cb28a";
    // const url = `https://us1.pusherplatform.io/services/chatkit/v1/${instanceLocator}/users`;

    // const chatManager = new Chatkit.ChatManager({
    //   instanceLocator: `v1:us1:${instanceLocator}`,
    //   userId: newName,
    //   tokenProvider: new Chatkit.TokenProvider({
    //     url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/6dd5be3c-e1dd-4fbe-a480-3687412cb28a/token"
    //   })
    // });

    // const httpRequest = new XMLHttpRequest();
    // httpRequest.open('POST', url);
    // httpRequest.send({
    //   "id": "aghee",
    //   "name": "aghee"
    // });

    this.props.history.push('/play');
  }

  render() {
    return (
      <div className="start-wrapper">
        <div className="start-box">
          <form onSubmit={(e) => this.submit(e)} className="start-form">
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
    )
  }
}