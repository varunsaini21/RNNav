const admin = require('firebase-admin');
const express = require('express');
const app = express();

app.use(express.json());

var serviceAccount = require('./rnnav-373af-firebase-adminsdk-nwzf9-3f380a938a.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/sendnotif', (req, res) => {
  console.log(req.body);
  const message = {
    notification: {
      title: 'New message from '+ req.body.sender.name,
      body: req.body.msg.text,
    },
    data: {
       msg: JSON.stringify(req.body.msg),
       receiver: JSON.stringify(req.body.receiver),
       sender: JSON.stringify(req.body.sender),
      },
    token: req.body.receiver.token,
  };

  admin
    .messaging()
    .send(message)
    .then(res => {
      console.log('Message send successfully',res);
    })
    .catch(err => {
      console.log('Error in sending message>>>', err);
    });
});

app.listen(3001, "192.168.249.27", () => {
  console.log('Server is running at 3001');
});
