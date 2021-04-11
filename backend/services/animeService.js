const logger = require('../loaders/logger');

const db = require('../loaders/database');

const searchAnime = async (query) => {
  return db
    .manyOrNone(
      `
    SELECT image_url, title, title_eng
    FROM ANIME
    WHERE title ILIKE $1
    `,
      [`%${query}%`]
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      logger.error(
        `Encountered an error when querying for anime.\n${err.stack}`
      );
    });
};

module.exports = { searchAnime };
