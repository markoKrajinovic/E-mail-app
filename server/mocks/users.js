/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  let usersRouter = express.Router();

  var firebase = require('firebase');
  var sha1 = require('sha1');   //algoritam za hashovanje passworda

  usersRouter.post('/', function (req, res) {

    if (!req.body.user.username || !req.body.user.password) {
      res.status(400).end();
      return;
    }

    if (!firebase.apps.length) {
      initializeFirebase();
    }
    var users = firebase.database().ref("users");

    var newUser = users.push(); 
    newUser.set({
      username: req.body.user.username,
      password: sha1(req.body.user.password),
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      created: req.body.user.created
    }).then(function () {
      res.send({
        user: {id: newUser.key}
      });
    }).catch(function (err) {
      //console.log(err);
      res.status(400).end();
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

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  app.use('/api/users', require('body-parser').json());
  app.use('/api/users', usersRouter);
};
