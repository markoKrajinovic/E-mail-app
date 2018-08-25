/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  let tokensRouter = express.Router();

  var firebase = require('firebase');
  var jwt = require('jsonwebtoken');
  var sha1 = require('sha1');   //algoritam za hashovanje passworda


  tokensRouter.post('/', function (req, res) {

    if(!req.body.identification || !req.body.password){
      res.status(400).end();
      return;
    }

    if (!firebase.apps.length) {
      initializeFirebase();
    }
    var users = firebase.database().ref("users");

    users.orderByChild("username").equalTo(req.body.identification).once("value", function (snapshot) {

      if (snapshot.exists()) {
        snapshot.forEach(function (userSnapshot) {   //ucice samo jednom u foreach jer je username unique
          var user = userSnapshot.val(); 
          if (user.password === sha1(req.body.password)) {
            sendToken(res, userSnapshot.key, user.username);
          } else {
            res.status(401).end();
          }
        });
      } else {
        res.status(401).end();
      }
    });
  });

  function initializeFirebase() {
    firebase.initializeApp({
      apiKey: 'xyz',
      authDomain: 'email-847fb.firebaseapp.com',
      databaseURL: 'https://email-847fb.firebaseio.com',
      storageBucket: 'email-847fb.appspot.com'
    });
  }

  function sendToken(res, userId, username) {
    var token = jwt.sign({ id: userId, username: username }, 'secretkey');
    res.send({
      token: token
    });
  }

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  app.use('/api/tokens', require('body-parser').json());
  app.use('/api/tokens', tokensRouter);
};