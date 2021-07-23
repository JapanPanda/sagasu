const express = require('express');
const route = express.Router();
const authService = require('../../../services/authService');

const passport = require('passport');
const { errors } = require('recombee-api-client');

module.exports = (app) => {
  app.use('/user', route);

  route.post('/validateSignup', async (req, res) => {
    const error = await authService.validateUser(req.body);

    if (error) {
      let errorMsg;
      if (error.errors !== undefined) {
        errorMsg = error.errors
          .map((ele) => {
            return ele.charAt(0).toUpperCase() + ele.slice(1);
          })
          .reduce((acc, curr) => {
            return (acc += '\n' + curr);
          });
      } else {
        errorMsg = error.error;
      }
      console.error(errorMsg);
      return res.status(400).json({ error: error, msg: errorMsg });
    }

    return res.json('Success');
  });

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
    res.cookie('loggedIn', 'false', {
      maxAge: 0,
    });
    res.json({ msg: 'Success' });
  });
};
