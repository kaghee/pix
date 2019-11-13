import { connect } from 'react-redux';
import { updateUserName } from '../actions';
import LandingPage from './LandingPage';

const mapStateToProps = state => ({
  userName: state.userName,
  roomName: state.roomName,
});

const mapDispatchToProps = {
  updateUserName,
};

const LandingPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);

export default LandingPageContainer;
