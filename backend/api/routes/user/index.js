const express = require('express');
const route = express.Router();

module.exports = (app) => {
  app.use('/user', route);

  route.get('/', (req, res) => {
    return res.json({ res: 'cool' }).status(200);
  });
};
