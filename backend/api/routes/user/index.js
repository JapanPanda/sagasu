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

  route.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json(info);
      }

      if (req.body.remember) {
        req.session.cookie.maxAge = 3600000 * 24 * 138;
        // dummy cookie to detect session cookie
        res.cookie('loggedIn', 'true', {
          maxAge: 3600000 * 24 * 138,
          httpOnly: false,
        });
      } else {
        req.session.cookie.maxAge = 3600000 * 24;
        // dummy cookie to detect session cookie
        res.cookie('loggedIn', 'true', {
          maxAge: 3600000 * 24,
          httpOnly: false,
        });
      }

      req.login(user, (err) => {
        if (err) {
          logger.error(err);
          res.cookie('loggedIn', 'false', {
            maxAge: 0,
          });
          return res.status(400).json({ msg: 'Something went wrong.' });
        }
        return res.status(200).json({ msg: 'Successfully logged in.' });
      });
    })(req, res, next);
  });

  route.get('/logout', (req, res) => {
    req.logout();
    res.json({ msg: 'Success' });
  });
};
