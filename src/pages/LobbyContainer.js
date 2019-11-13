import { connect } from 'react-redux';
import Lobby from './Lobby';

const mapStateToProps = state => ({
  // username: state.username,
  // roomName: state.roomName,
});

const mapDispatchToProps = {
};

const LobbyContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Lobby);

export default LobbyContainer;
