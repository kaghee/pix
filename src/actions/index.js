export function updateRoomName(roomName) {
  return {
    type: 'UPDATE_ROOM_NAME',
    roomName,
  };
}

export function updateUserName(userName) {
  return {
    type: 'UPDATE_USER_NAME',
    userName,
  };
}
