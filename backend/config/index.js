const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Env file not found");
}

module.exports = {
  port: 3000,
  api: {
    prefix: '/api',
  },
}