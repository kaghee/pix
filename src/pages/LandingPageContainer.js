import { connect } from 'react-redux';
import { updateUsername, updateRoomName } from '../actions';
import LandingPage from './LandingPage';

const mapStateToProps = state => ({
  username: state.username,
  roomName: state.roomName,
});

const mapDispatchToProps = {
  updateUsername,
  updateRoomName,
};

const LandingPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);

export default LandingPageContainer;
