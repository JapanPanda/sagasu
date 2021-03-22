const express = require('express');
const route = express.Router();
const authService = require('../../../services/authService');

const passport = require('passport');

module.exports = (app) => {
  app.use('/user', route);

  route.post('/signup', async (req, res) => {
    const { user, error } = await authService.signup(req.body);

    if (error) {
      return res.status(400).json({ error: error, msg: 'Error' });
    }

    return res.json(`Successfully signed up ${user.username}.`);
  });

  route.post('/login', passport.authenticate('local'), (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).json(info);
      }

      return res.status(200).json({ msg: 'Successfully logged in.' });
    })(req, res, next);
  });

  route.get('/logout', (req, res) => {
    req.logout();
    res.json({ msg: 'Success' });
  });
};
