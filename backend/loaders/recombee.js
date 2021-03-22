var recombee = require('recombee-api-client');
const config = require('../config');

const client = new recombee.ApiClient(
  config.recombee_id,
  config.recombee_token
);

module.exports = client;
