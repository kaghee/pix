const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('pusher-chatkit-server');

const app = express();

const instanceLocator = "v1:us1:6dd5be3c-e1dd-4fbe-a480-3687412cb28a";
const secretKey = "31673abc-9023-4ee3-8209-fb05b3691c3d:EX9gaDSV2Id8210+Mo26GLThLmF3bDmvZ4IV7kWeM8w=";

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
      console.log('User created successfully');
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

// app.post('/authenticate', (req, res) => {
//   const authData = chatkit.authenticate({ userId: req.query.user_id })
//   res.status(authData.status).send(authData.body)
// })


const PORT = 4000
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})