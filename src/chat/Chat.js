import React, { Component } from 'react';
import { MessageList } from './MessageList';
import { SendMessageForm } from './SendMessageForm';

export class Chat extends Component {
  // constructor() {
  //   super()
  //   this.state = {
  //     messages: []
  //   }
  // }
  
  render() {
    return (
      <div className="chat">
        <MessageList messages={this.props.messages} />
        <SendMessageForm sendMessage={this.props.updateMessage} />
      </div>
    )
  }
}

//   componentDidMount() {

//     const chatManager = new Chatkit.ChatManager({
//       instanceLocator: instanceLocator,
//       userId: username,
//       tokenProvider: new Chatkit.TokenProvider({
//         url: testToken
//       })
//     });

//     chatManager.connect().then(currentUser => {
//       this.currentUser = currentUser;
//       currentUser.subscribeToRoom({
//         roomId: roomId,
//         hooks: {
//           onNewMessage: message => {
//             this.setState({
//               messages: [...this.state.messages, message]
//             })
//           }
//         }
//       })
//     })
//   }

  // sendMessage = (text) => {
  //   this.props.name.sendMessage({
  //     text,
  //     roomId: roomId
  //   })
  // }
