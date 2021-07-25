const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const dir = path.join(path.dirname(require.main.filename), '../assets/');

const logger = require('../loaders/logger');

const db = require('../loaders/database');

const axios = require('axios');

const recombee = require('recombee-api-client');
const client = new recombee.ApiClient(
  process.env.RECOMBEE_ID,
  process.env.RECOMBEE_TOKEN
);
const rqs = recombee.requests;

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const updateGithubRepo = () => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

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
  await db.query(
    `CREATE TABLE IF NOT EXISTS account(
      id SERIAL PRIMARY KEY,
      username text NOT NULL,
      email text NOT NULL,
      password text NOT NULL,
      liked int[] NOT NULL,
      disliked int[] NOT NULL,
      saved int[] NOT NULL
    );`
  );

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

  // const API_URL = 'http://localhost:9001/v3/anime/';

  const API_URL = 'https://api.jikan.moe/v3/anime/';
  for (let anime = 0; anime < animeOfflineDB.data.length; anime++) {
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
        if (err.response) {
          if (err.response.status == 429 || err.response.status == 403) {
            anime--;
          }
        }
        logger.error(
          `Error getting anime from api.\n${err.response}\n${err.stack}`
        );
      });

    await sleep(4000);
  }
};

const updateRecombee = async () => {
  return client
    .send(
      new rqs.Batch([
        new rqs.AddItemProperty('genres', 'set'),
        new rqs.AddItemProperty('date', 'timestamp'),
        new rqs.AddItemProperty('ranked', 'int'),
        new rqs.AddItemProperty('popularity', 'int'),
        new rqs.AddItemProperty('score', 'double'),
        new rqs.AddItemProperty('title', 'string'),
        new rqs.AddItemProperty('synopsis', 'string'),
        new rqs.AddItemProperty('studio', 'set'),
      ])
    )
    .then(() => {
      db.manyOrNone(`SELECT * from anime;`).then((data) => {
        // create requests
        const requests = data.map((row) => {
          let season = row.premiered.split(' ')[0];
          let month = null;
          if (season == 'Fall') {
            month = 9;
          } else if (season == 'Winter') {
            month = 0;
          } else if (season == 'Spring') {
            month = 3;
          } else {
            month = 6;
          }

          return new rqs.SetItemValues(
            row.mal_id,
            {
              genres: row.genres,
              date: new Date(row.year, month).toISOString(),
              ranked: row.ranked,
              popularity: row.popularity,
              score: row.score,
              title: row.title,
              synopsis: row.synopsis,
              studio: row.studio,
            },
            {
              cascadeCreate: true,
            }
          );
        });

        client
          .send(new rqs.Batch(requests))
          .then((res) => {
            logger.info(
              `Successfully updated Recombee's database of ${res.length} items.`
            );
          })
          .catch((err) => {
            logger.error(
              `Error inserting entry ${row.mal_id}, index: 20.\n${err.stack}`
            );
          });
      });
    })
    .catch((err) => {
      logger.error(`Error adding item property.\n${err.stack}`);
    });
};

const update = async () => {
  logger.info('Updating offline database.');
  updateGithubRepo();

  logger.info('Updating PostgreSQL database.');
  await updatePostgreSQL();

  logger.info('Updating Recombee database.');
  await updateRecombee();

  logger.info('Finished updating.');
};

update();

module.exports = update;
