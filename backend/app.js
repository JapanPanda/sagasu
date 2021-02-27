// Entry point for app

const config = require('./config');

const express = require('express');

async function startServer() {
  const app = express();

  app.listen(config.port, () => {

  }).on((err) => {
    
    process.exit(1);
  })
}

startServer();