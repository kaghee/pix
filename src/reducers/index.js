const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_ROOM_NAME = 'UPDATE_ROOM_NAME';

export default function reducer(
  state = {
    username: '',
    roomName: '',
  }, action = {},
) {
  switch (action.type) {
    case UPDATE_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case UPDATE_ROOM_NAME:
      return {
        ...state,
        roomName: action.roomName,
      };
    default:
      return state;
  }
}
