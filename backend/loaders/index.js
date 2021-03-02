const expressLoader = require('./express');
const database = require('./database');

const logger = require('./logger');

module.exports = async (expressApp) => {
  if (database !== null) {
    logger.info('Established connection with database.');
  }

  await expressLoader(expressApp);

  logger.info('Loaded everything.');
};
