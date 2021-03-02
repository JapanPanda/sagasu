const express = require('express');
const route = express.Router();

module.exports = (app) => {
  app.use('/sagasu', route);

  route.get('/', (req, res) => {
    return res.json({ res: 'sagasu' }).status(200);
  });
};
