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

app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/users', (req, res) => {
  const { username } = req.body;

  chatkit.createUser({
    id: username,
    name: username,
  })
    .then(() => {
      console.log(`User ${username} created successfully`);
      res.sendStatus(201);
    })
    .catch((error) => {
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

  socket.on('reset', () => {
    socket.broadcast.emit('reset');
  });

  socket.on('userLeave', (userId) => {
    chatkit.deleteUser({ userId }).then(() => {
      console.log('User deleted successfully');
    });
  });

  socket.on('newWordToGuess', (word) => {
    socket.broadcast.emit('newWordIsUp', word);
  });

  socket.on('startCountDown', () => {
    io.emit('startCountDown');
  });
});
