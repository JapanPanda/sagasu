// Entry point for app

const config = require('./config');

const express = require('express');

const logger = require('./loaders/logger');

async function startServer() {
  const app = express();

  await require('./loaders')(app);

  app
    .listen(config.port, () => {
      logger.info(`Listening on port ${config.port}`);
    })
    .on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();
