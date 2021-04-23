const logger = require('../loaders/logger');

const db = require('../loaders/database');

const recombee = require('recombee-api-client');
const rqs = recombee.requests;
const recombeeClient = require('../loaders/recombee');

const recommendAnime = async (user_id) => {
  return recombeeClient
    .send(
      new rqs.RecommendItemsToUser(user_id, 1, {
        rotationRate: 0,
        cascadeCreate: true,
      })
    )
    .then((res) => {
      const anime_ids = res.recomms.map((row) => parseInt(row.id));
      return db
        .any(
          `SELECT * FROM ANIME
                WHERE mal_id in ($1:csv);`,
          [anime_ids]
        )
        .then((animes) => {
          return animes;
        })
        .catch((err) => {
          logger.error(
            `Error when recommending anime for user ${user_id}.\n${err}`
          );
          return null;
        });
    });
};

const getLikedAnimes = async (user_id) => {
  return db
    .one(
      `SELECT liked FROM account
                                WHERE id = $1`,
      [user_id]
    )
    .then((row) => {
      return row.liked;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when querying for liked animes.\n${err}`
      );
      return null;
    });
};

const likeAnime = async (mal_id, user_id) => {
  const liked_animes = await getLikedAnimes(user_id);

  // anime is already in liked anime
  if (liked_animes.includes(mal_id)) {
    return null;
  }

  const promise1 = db
    .none(
      `UPDATE account
                  SET liked = array_append(liked, $1)
                  WHERE id = $2;`,
      [mal_id, user_id]
    )
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Postgres liked animes.\n${err}`
      );
      return null;
    });

  const promise2 = recombeeClient
    .send(
      new rqs.AddRating(user_id, mal_id, 1, {
        cascadeCreate: true,
      })
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Recombee liked animes.\n${err}`
      );
      return null;
    });

  const data = await Promise.all([promise1, promise2]);
  return data;
};

const unlikeAnime = async (mal_id, user_id) => {
  const liked_animes = await getLikedAnimes(user_id);
  // anime isn't in liked anime array
  if (!liked_animes.includes(mal_id)) {
    return null;
  }

  const promise1 = db
    .none(
      `UPDATE account
                  SET liked = array_remove(liked, $1)
                  WHERE id = $2;`,
      [mal_id, user_id]
    )
    .catch((err) => {
      logger.error(
        `Something went wrong when updating (unlike) Postgres liked animes.\n${err}`
      );
      return null;
    });

  const promise2 = recombeeClient
    .send(
      new rqs.DeleteRating(user_id, mal_id, {
        cascadeCreate: true,
      })
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when updating (unlike) Recombee liked animes.\n${err}`
      );
      return null;
    });

  const data = await Promise.all([promise1, promise2]);
  return data;
};

const getDislikedAnimes = async (user_id) => {
  return db
    .one(
      `SELECT disliked FROM account
                                WHERE id = $1`,
      [user_id]
    )
    .then((row) => {
      return row.disliked;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when querying for disliked animes.\n${err}`
      );
      return null;
    });
};

const dislikeAnime = async (mal_id, user_id) => {
  const disliked_animes = await getDislikedAnimes(user_id);

  // anime is already in disliked anime
  if (disliked_animes.includes(mal_id)) {
    return null;
  }

  const promise1 = db
    .none(
      `UPDATE account
                  SET disliked = array_append(disliked, $1)
                  WHERE id = $2;`,
      [mal_id, user_id]
    )
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Postgres liked animes.\n${err}`
      );
      return null;
    });

  const promise2 = recombeeClient
    .send(
      new rqs.AddRating(user_id, mal_id, -1, {
        cascadeCreate: true,
      })
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Recombee liked animes.\n${err}`
      );
      return null;
    });

  const data = await Promise.all([promise1, promise2]);
  return data;
};

const undislikeAnime = async (mal_id, user_id) => {
  const disliked_animes = await getDislikedAnimes(user_id);

  // anime is already in disliked anime
  if (!disliked_animes.includes(mal_id)) {
    return null;
  }

  const promise1 = db
    .none(
      `UPDATE account
                  SET disliked = array_remove(disliked, $1)
                  WHERE id = $2;`,
      [mal_id, user_id]
    )
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Postgres liked animes.\n${err}`
      );
      return null;
    });

  const promise2 = recombeeClient
    .send(
      new rqs.DeleteRating(user_id, mal_id, {
        cascadeCreate: true,
      })
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Recombee liked animes.\n${err}`
      );
      return null;
    });

  const data = await Promise.all([promise1, promise2]);
  return data;
};

const getSavedAnimes = async (user_id) => {
  return db
    .one(
      `SELECT saved FROM account
                                WHERE id = $1`,
      [user_id]
    )
    .then((row) => {
      return row.saved;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when querying for saved animes.\n${err}`
      );
      return null;
    });
};

const saveAnime = async (mal_id, user_id) => {
  const saved_animes = await getSavedAnimes(user_id);

  // anime is in disliked anime
  if (saved_animes.includes(mal_id)) {
    return null;
  }

  const promise1 = db
    .none(
      `UPDATE account
                  SET saved = array_append(saved, $1)
                  WHERE id = $2;`,
      [mal_id, user_id]
    )
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Postgres saved animes.\n${err}`
      );
      return null;
    });

  const promise2 = recombeeClient
    .send(
      new rqs.AddBookmark(user_id, mal_id, {
        cascadeCreate: true,
      })
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Recombee saved animes.\n${err}`
      );
      return null;
    });

  const data = await Promise.all([promise1, promise2]);
  return data;
};

const unsaveAnime = async (mal_id, user_id) => {
  const saved_animes = await getSavedAnimes(user_id);

  // anime is not in disliked anime
  if (!saved_animes.includes(mal_id)) {
    return null;
  }

  const promise1 = db
    .none(
      `UPDATE account
                  SET saved = array_remove(saved, $1)
                  WHERE id = $2;`,
      [mal_id, user_id]
    )
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Postgres saved animes.\n${err}`
      );
      return null;
    });

  const promise2 = recombeeClient
    .send(
      new rqs.DeleteBookmark(user_id, mal_id, {
        cascadeCreate: true,
      })
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      logger.error(
        `Something went wrong when updating Recombee saved animes.\n${err}`
      );
      return null;
    });

  const data = await Promise.all([promise1, promise2]);
  return data;
};

module.exports = {
  recommendAnime,
  likeAnime,
  unlikeAnime,
  dislikeAnime,
  undislikeAnime,
  saveAnime,
  unsaveAnime,
};
