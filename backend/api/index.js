const express = require('express');
const Router = express.Router;

const user = require('./routes/user');
const sagasu = require('./routes/sagasu');
const anime = require('./routes/anime');

module.exports = () => {
  const app = Router();
  user(app);
  sagasu(app);
  anime(app);

  return app;
};
