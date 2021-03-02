const express = require('express');
const Router = express.Router;

const user = require('./routes/user');

module.exports = () => {
  const app = Router();
  user(app);

  return app;
};
