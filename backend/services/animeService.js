const logger = require('../loaders/logger');

const db = require('../loaders/database');

const searchAnime = async (query) => {
  return db
    .manyOrNone(
      `
    SELECT image_url, title, title_eng, year, mal_id
    FROM ANIME
    WHERE title ILIKE $1 OR title_eng ILIKE $1
    limit 20
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
