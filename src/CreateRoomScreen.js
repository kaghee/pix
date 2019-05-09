import React, { Component } from 'react';
import './StartScreens.scss';

export default class CreateRoomScreen extends Component {
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

  componentDidMount() {
    console.log('name', this.state.name);
  }

  handlePlay = () => {
    this.props.history.push('/play');
  }

  render() {
    return (
      <div className="start-wrapper">
        <div className="start-box">
          <div className="start-form">
            <div className="rounds">
              <span className="label">Rounds:</span>
              <select>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10" defaultValue>10</option>
              </select>
            </div>
            <div className="round-length">
              <span className="label">Draw time:</span>
              <input type="text" maxLength="3" />
            </div>
            <input className="btn play" type="button" value="Play!" onClick={this.handlePlay} />
          </div>
        </div>
      </div>
    );
  }
}
