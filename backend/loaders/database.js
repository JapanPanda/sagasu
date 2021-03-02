const pgp = require('pg-promise')();

const config = require('../config');

const db = pgp(config.database_uri);

module.exports = db;
