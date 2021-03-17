const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const dir = path.join(path.dirname(require.main.filename), '../assets/');

const logger = require('../loaders/logger');

const db = require('../loaders/database');

const axios = require('axios');

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const updateGithubRepo = () => {
  // if github repo does not exist
  if (!fs.existsSync(path.join(dir, '/anime-offline-database'))) {
    logger.info('Offline database does not exist, cloning...');

    shell.cd(dir);
    if (
      shell.exec(
        'git clone https://github.com/manami-project/anime-offline-database.git'
      ).code !== 0
    ) {
      logger.error('Error cloning offline database.');
      return;
    }

    logger.info('Offline database successfully cloned.');

    return;
  }

  shell.cd(path.join(dir, '/anime-offline-database'));
  if (shell.exec('git pull origin master').code !== 0) {
    logger.error('Error updating offline database repo.');
    return;
  }

  logger.info('Offline database successfully updated.');
};

const updatePostgreSQL = async () => {
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS anime(
      mal_id integer PRIMARY KEY NOT NULL,
      mal_url text NOT NULL,
      anilist_url text,
      genres text[] NOT NULL,
      year integer NOT NULL,
      ranked integer,
      popularity integer,
      score decimal,
      title text NOT NULL,
      title_eng text,
      synopsis text NOT NULL,
      type text NOT NULL,
      premiered text NOT NULL,
      studio text[] NOT NULL,
      episodes integer NOT NULL,
      image_url text
    );`
    )
    .catch((err) => {
      logger.error(`Error creating Anime table.\n${err.stack}`);
    });

  const animeOfflineDB = JSON.parse(
    fs.readFileSync(
      path.join(dir, '/anime-offline-database/anime-offline-database.json')
    )
  );

  const API_URL = 'http://localhost:9001/v3/anime/';
  for (let anime in animeOfflineDB.data) {
    //"https://myanimelist.net/anime/5781"
    let sources = animeOfflineDB.data[anime].sources;
    let mal_source = null;
    let anilist_source = null;

    // get the sources
    for (let source of sources) {
      if (mal_source !== null && anilist_source !== null) {
        break;
      }

      if (source.includes('myanimelist')) {
        mal_source = source;
      } else if (source.includes('anilist')) {
        anilist_source = source;
      }
    }

    if (mal_source === null) {
      // anime doesnt have a mal entry
      continue;
    }

    let mal_id = mal_source.split('/').slice(-1)[0]; // get the id

    axios
      .get(API_URL + mal_id)
      .then((res) => {
        let mal_data = res.data;

        if (
          mal_data.premiered === null ||
          mal_data.studios === null ||
          mal_data.episodes === null ||
          mal_data.synopsis === null
        ) {
          return;
        }

        let year = parseInt(mal_data.premiered.split(' ')[1]);
        let genres = mal_data.genres.map((genre) => genre.name);
        let studios = mal_data.studios.map((studio) => studio.name);

        db.none(
          `INSERT INTO anime(mal_id, mal_url, anilist_url, genres, year, 
          ranked, popularity, score, title, title_eng, synopsis, type, 
          premiered, studio, episodes, image_url)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 
              $13, $14, $15, $16)
            ON CONFLICT (mal_id)
            DO UPDATE
            SET (mal_id, mal_url, anilist_url, genres, year, 
              ranked, popularity, score, title, title_eng, synopsis, type, 
              premiered, studio, episodes, image_url) 
              = 
              (EXCLUDED.mal_id, EXCLUDED.mal_url, EXCLUDED.anilist_url, 
                EXCLUDED.genres, EXCLUDED.year, 
                EXCLUDED.ranked, EXCLUDED.popularity, EXCLUDED.score, 
                EXCLUDED.title, EXCLUDED.title_eng, EXCLUDED.synopsis,
                EXCLUDED.type, EXCLUDED.premiered, EXCLUDED.studio, 
                EXCLUDED.episodes, EXCLUDED.image_url);
        `,
          [
            mal_data.mal_id,
            mal_data.url,
            anilist_source,
            genres,
            year,
            mal_data.rank !== 0 ? mal_data.rank : null,
            mal_data.popularity !== 0 ? mal_data.popularity : null,
            mal_data.score !== 0 ? mal_data.score : null,
            mal_data.title,
            mal_data.title_english,
            mal_data.synopsis,
            mal_data.type,
            mal_data.premiered,
            studios,
            mal_data.episodes,
            mal_data.image_url,
          ]
        )
          .then(() => {
            logger.info(
              `Successfully inserted entry ${mal_data.mal_id}, index: ${anime}.`
            );
          })
          .catch((err) => {
            logger.error(
              `Error inserting entry ${mal_data.mal_id}.\n${err.stack}`
            );
          });
      })
      .catch((err) => {
        logger.error(`Error getting anime from api.\n${err.stack}`);
      });

    await sleep(2000);
  }
};

const update = async () => {
  logger.info('Updating offline database.');
  updateGithubRepo();

  logger.info('Updating PostgreSQL database.');
  await updatePostgreSQL();
};

updatePostgreSQL();

module.exports = update;
