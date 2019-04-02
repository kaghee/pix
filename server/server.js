const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Chatkit = require('@pusher/chatkit-server');

const app = express();

const instanceLocator = "v1:us1:aecdc8b8-e7df-41c8-b3d1-c141e957ce9e";
const secretKey = "b19e1576-cfd3-467e-bc47-93b00d4b2f60:ftpEZSxYsLn9v7M2kAmI0YT6Lmh5WQXIH78yAisQpSc=";

const chatkit = new Chatkit.default({
  instanceLocator: instanceLocator,
  key: secretKey,
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/users', (req, res) => {
  const { username } = req.body;

  chatkit.createUser({
    id: username,
    name: username
  })
    .then((response) => {
      console.log(`User ${username} created successfully`);
      res.sendStatus(201);
    })
    .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})
//
// app.post('/authenticate', (req, res) => {
//   const authData = chatkit.authenticate({ userId: req.query.user_id })
//   res.status(authData.status).send(authData.body);
// })


const PORT = 4000;
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})