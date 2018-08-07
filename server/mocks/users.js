/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  let usersRouter = express.Router();

  var firebase = require('firebase');
  var sha1 = require('sha1');   //algoritam za hashovanje passworda

  usersRouter.post('/', function (req, res) {

    if (!req.body.user.username || !req.body.user.password) {
      res.status(400).send('usarname and password are required');
      return;
    }

    if (!firebase.apps.length) {
      initializeFirebase();
    }
    var users = firebase.database().ref("users");

    users.orderByChild("username").equalTo(req.body.user.username).once("value", function (snapshot) {
      if (snapshot.exists()) {
        res.status(400).send('username already exists');
      } else {
        var newUser = users.push();
        newUser.set({
          username: req.body.user.username,
          password: sha1(req.body.user.password),
          firstName: req.body.user.firstName,
          lastName: req.body.user.lastName
        }).then(function () {
          res.send({
            user: { id: newUser.key }
          });
        }).catch(function (err) {
          res.status(400).send('database error');
        });
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



    /*
  usersRouter.get('/', function (req, res) {
    if (!firebase.apps.length) {
      initializeFirebase();
    }
    var users = firebase.database().ref("users");

    users.orderByChild("username").equalTo(req.query.filter.username).once("value", function (snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach(function (userSnapshot) {   //ucice samo jednom u foreach jer je username unique
          var user = userSnapshot.val();
          res.send({ user: user });
        });
      } else {
        res.status(400).end();
      }
    });
  });
*/
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
