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

  route.get('/isLoggedIn', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ loggedIn: false });
    }

    return res.status(200).json({ loggedIn: true });
  });

  route.post('/login', passport.authenticate('local'), (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).json(info);
      }

      if (req.body.remember) {
        req.session.cookie.maxAge = 3600000 * 24 * 138;
      } else {
        req.session.cookie.maxAge = 3600000 * 24;
      }

      return res.status(200).json({ msg: 'Successfully logged in.' });
    })(req, res, next);
  });

  route.get('/logout', (req, res) => {
    req.logout();
    res.json({ msg: 'Success' });
  });
};
