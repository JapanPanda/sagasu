const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require('../api');
const config = require('../config');
const passport = require('passport');
const redis = require('redis');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

const cookieParser = require('cookie-parser');

module.exports = (app) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cookieParser());

  app.use(
    session({
      // 6 months ttl
      store: new RedisStore({ client: redisClient, ttl: 15552000 }),
      secret: config.session_secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 15552000000,
        path: '/',
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  require('./passport');

  app.use(config.api.prefix, routes());

  app.use((req, res, next) => {
    const err = new Error('Not found');
    err['status'] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
