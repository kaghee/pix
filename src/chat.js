import stars from './assets/stars.txt';

const chatServer = 'http://localhost:4000';
const token = '';

function getRandomRoomName() {
  const words = stars.split('\n');
  const random = Math.floor(Math.random() * words.length);
  return words.slice(random, random + 1)[0];
}

function createUser(username, isOwner) {
  fetch(`${chatServer}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4001',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      isOwner,
    }),
  });
}

function enterChat(username, roomName) {
  console.log('entering chat');
  const isOwner = roomName === 'newRoom';

  createUser(username, isOwner);
  //
  // const newRoomName = getRandomRoomName();
  // createRoom(username, newRoomName);
}

export default function createRoom(username) {
  enterChat(username, 'newRoom');
}
