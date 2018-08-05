/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  let usersRouter = express.Router();

  var firebase = require('firebase');


  usersRouter.get('/', function (req, res) {
    res.send({
      'users': []
    });
  });

  usersRouter.post('/', function (req, res) {
    if (!firebase.apps.length) {
      initializeFirebase();
    }
    var users = firebase.database().ref("users");

    users.push().set({
      username: req.body.user.username,
      password: req.body.user.password,
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      created: req.body.user.created
    }).then(function () {
      res.status(201);
    }).catch(function (err) {
      console.log(err);
      res.status(403).end();
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
