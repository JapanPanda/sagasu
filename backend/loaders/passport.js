const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const authService = require('../services/authService');

const argon = require('argon2');

const logger = require('../loaders/logger');

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await authService.findUserbyUsername(username);
      if (!user) {
        return done(null, false, {
          msg: `Invalid username or password.`,
        });
      }

      const success = await argon.verify(user.password, password);

      if (!success) {
        return done(null, false, { msg: `Invalid username or password.` });
      }

      done(null, user);
    } catch (err) {
      logger.error(`Error in passport local strategy.\n${err}`);
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.findUserbyId(id);
    if (!user) {
      done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
