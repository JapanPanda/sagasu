const expressLoader = require('./express');
const database = require('./database');
const recombee = require('./recombee');
const logger = require('./logger');

module.exports = async (expressApp) => {
  if (database !== null) {
    logger.info('Established connection with database.');
  }

  if (recombee !== null) {
    logger.info('Established connection with recombee.');
  }

  await expressLoader(expressApp);

  logger.info('Loaded everything.');
};
