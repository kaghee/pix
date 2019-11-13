import { connect } from 'react-redux';
import { updateUsername } from '../actions';
import LandingPage from './LandingPage';

const mapStateToProps = state => ({
  username: state.username,
  roomName: state.roomName,
});

const mapDispatchToProps = {
  updateUsername,
};

const LandingPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);

export default LandingPageContainer;
