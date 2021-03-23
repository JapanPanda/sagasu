const express = require('express');
const Router = express.Router;

const user = require('./routes/user');
const sagasu = require('./routes/sagasu');

module.exports = () => {
  const app = Router();
  user(app);
  sagasu(app);

  return app;
};
