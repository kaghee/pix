const UPDATE_USER_NAME = 'UPDATE_USER_NAME';
const UPDATE_ROOM_NAME = 'UPDATE_ROOM_NAME';

export default function reducer(
  state = {
    userName: '',
    roomName: '',
  }, action = {},
) {
  switch (action.type) {
    case UPDATE_USER_NAME:
      return {
        ...state,
        userName: action.userName,
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
