const dotenv = require('dotenv');
const path = require('path');

const envFound = dotenv.config({
  path: path.join(__dirname, '../.env'),
});

if (envFound.error) {
  throw new Error('Env file not found');
}

module.exports = {
  port: 3001,
  api: {
    prefix: '/api',
  },
  database_uri: process.env.DATABASE_URI,
  recombee_id: process.env.RECOMBEE_ID,
  recombee_token: process.env.RECOMBEE_TOKEN,
  session_secret: process.env.SESSION_SECRET,
  jwt_secret: process.env.JWT_SECRET,
};
