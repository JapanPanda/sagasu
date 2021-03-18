const pgp = require('pg-promise')();

const config = require('../config');

const cn = {
  connectionString: config.database_uri,
  ssl: { rejectUnauthorized: false },
};

const db = pgp(cn);

module.exports = db;
