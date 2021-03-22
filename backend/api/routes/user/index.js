const express = require('express');
const route = express.Router();
const authService = require('../../../services/authService');

module.exports = (app) => {
  app.use('/user', route);

  route.post('/signup', async (req, res) => {
    const { user, error } = await authService.signup(req.body);

    if (error) {
      return res.status(400).json({ error: error, msg: 'Error' });
    }

    return res.json(`Successfully signed up ${user.username}.`);
  });
};
