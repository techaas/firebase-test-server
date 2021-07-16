// Copyright(c) 2021 TECHaas.com. All rights reserved. 
//

'use strict';

// [START gae_node_request_example]
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());

app.get('/', verifyToken, (req, res) => {
  res.status(200).send('IDを確認しました.').end();
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    admin
      .auth()
      .verifyIdToken(token)
      // eslint-disable-next-line no-unused-vars
      .then((_decoded) => {
        next();
      })
      .catch(error => {
        console.log(error);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(403);
  }
}

// Start the server
const PORT = process.env.PORT || 8030;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
