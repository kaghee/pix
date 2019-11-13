export function updateRoomName(roomName) {
  return {
    type: 'UPDATE_ROOM_NAME',
    roomName,
  };
}

export function updateUsername(username) {
  return {
    type: 'UPDATE_USERNAME',
    username,
  };
}
