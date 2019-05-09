import React, { Component } from 'react';
import './StartScreens.scss';

export default class StartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };
  }
  // submit = (e) => {
  //   e.preventDefault();
  //   const newName = e.target.querySelector('input').value;
  //
  //   this.props.onNameChange(newName);
  //
  //   this.props.history.push('/play');
  // }
  //
  // render() {
  //   return (
  //     <div className="start-wrapper">
  //       <div className="start-box">
  //         <form onSubmit={e => this.submit(e)} className="start-form">
  //           <input type="text" className="name" placeholder="Enter your name" maxLength="14" />
  //           <div className="rounds">
  //             <span className="rounds">Rounds:</span>
  //             <select>
  //               <option value="3">3</option>
  //               <option value="5">5</option>
  //               <option value="10" defaultValue>10</option>
  //             </select>
  //           </div>
  //           <div className="play-button-area">
  //             <input className="btn play" type="submit" value="Play!" />
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // }

  handleNameChange = (e) => {
    e.preventDefault();
    this.setState({
      name: e.target.value,
    });
  }

  handleCreateRoom = () => {
    this.props.enterChat(this.state.name, 'newRoom');

    this.props.createRoom(this.state.name);
    this.props.history.push('/create');
  }

  handlePlay = () => {
    this.props.enterChat(this.state.name, 'default');
    this.props.history.push('/play');
  }

  render() {
    return (
      <div className="start-wrapper">
        <div className="start-box">
          <div className="start-form">
            <input type="text" className="name" placeholder="Enter your name" maxLength="14" onChange={this.handleNameChange} />
            <div className="button-area">
              <input className="btn play" type="button" value="Create Room" onClick={this.handleCreateRoom} disabled={!this.state.name} />
              <input className="btn play" type="button" value="Play!" onClick={this.handlePlay} disabled={!this.state.name} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
