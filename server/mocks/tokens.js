/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let tokensRouter = express.Router();

  var jwt = require('jsonwebtoken');
  
  tokensRouter.post('/', function(req, res) {
    if (req.body.identification === 'pera' && req.body.password === 'pera') {
      var token = jwt.sign({ email: 'pera'}, 'secretkey');
      res.send({
        token: token
      });
    } else {
      res.status(401).end();
    }
  });


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
