const dotenv = require('dotenv');
const path = require('path');

const envFound = dotenv.config({
  path: path.join(__dirname, '../.env'),
});

if (envFound.error) {
  throw new Error('Env file not found');
}

module.exports = {
  port: 3000,
  api: {
    prefix: '/api',
  },
  database_uri: process.env.DATABASE_URI,
};
