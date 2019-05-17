const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Chatkit = require('@pusher/chatkit-server');

const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let currentWord = '';

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on port ${PORT}`);
  }
});

const instanceLocator = 'v1:us1:aecdc8b8-e7df-41c8-b3d1-c141e957ce9e';
const secretKey = 'b19e1576-cfd3-467e-bc47-93b00d4b2f60:ftpEZSxYsLn9v7M2kAmI0YT6Lmh5WQXIH78yAisQpSc=';

const chatkit = new Chatkit.default({
  instanceLocator,
  key: secretKey,
});

let userIndex = 0;

app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/users', (req, res) => {
  const { username, owner } = req.body;
  userIndex += 1;

  chatkit.createUser({
    id: username,
    name: username,
    customData: {
      score: 0,
      finished: false,
      roomOwner: owner,
      userIndex,
    },
  }).then(() => {
    console.log(`User ${username} created successfully`);
    res.sendStatus(201);
  }).catch((error) => {
    if (error.error_type === 'services/chatkit/user_already_exists') {
      res.sendStatus(200);
    } else {
      res.status(error.status).json(error);
    }
  });
});

io.on('connection', (socket) => {
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', { data });
  });

  socket.on('changeColour', (newColour) => {
    socket.broadcast.emit('changeColour', newColour);
  });

  socket.on('changePreset', (newPreset) => {
    socket.broadcast.emit('changePreset', newPreset);
  });

  // socket.on('fill', (imageData) => {
  //   socket.broadcast.emit('fill', imageData);
  // });

  socket.on('resetCanvas', () => {
    socket.broadcast.emit('resetCanvas');
  });

  socket.on('resetCanvasForAll', () => {
    io.emit('resetCanvas');
  });

  socket.on('userLeave', async (userId) => {
    const rooms = await chatkit.getUserRooms({
      userId,
    }).catch((err) => {
      console.log(err);
    });

    const room = await rooms.find((rm) => {
      const members = rm.member_user_ids;
      return members.includes(userId);
    });

    chatkit.sendSimpleMessage({
      userId,
      roomId: room.id,
      text: 'SYSTEM user left',
    }).catch(err => console.log(err));

    chatkit.removeUsersFromRoom({
      roomId: room.id,
      userIds: [userId],
    }).catch(err => console.error(err));

    chatkit.deleteUser({ userId }).then(() => {
      console.log('User deleted successfully');
    });
  });

  socket.on('userChoosingWord', (user) => {
    socket.broadcast.emit('userChoosingWord', user);
  });

  socket.on('newWordToGuess', (word) => {
    currentWord = word;
    const dummy = word.split('').map(() => '_').join('');
    socket.broadcast.emit('newWordIsUp', dummy);
  });

  socket.on('startCountDown', () => {
    io.emit('startCountDown');
  });

  socket.on('incomingGuess', async (user, word) => {
    // TODO ezt kiszervezni
    const rooms = await chatkit.getUserRooms({
      userId: user,
    }).catch((err) => {
      console.log(err);
    });
    const room = rooms.find(rm => rm.member_user_ids.includes(user));
    const chatkitUser = await chatkit.getUser({ id: user });

    if (word === currentWord) {
      chatkit.sendSimpleMessage({
        userId: chatkitUser.id,
        roomId: room.id,
        text: 'SYSTEM correct guess',
      }).catch(err => console.log(err));
    } else {
      chatkit.sendSimpleMessage({
        userId: chatkitUser.id,
        roomId: room.id,
        text: word,
      }).catch(err => console.log(err));
    }
  });

  socket.on('endRound', () => {
    io.emit('endRound', currentWord);
  });

  socket.on('userJoined', (user, room) => {
    socket.broadcast.emit('userJoined', user, room);
  });

  socket.on('startGame', () => {
    io.emit('startGame');
  });
});
