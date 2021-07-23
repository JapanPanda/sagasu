const logger = require('../loaders/logger');

const sagasuService = require('./sagasuService');

const db = require('../loaders/database');

const yup = require('yup');

const argon = require('argon2');

const signupSchema = yup.object().shape({
  username: yup.string().required().min(3).max(16),
  password: yup.string().required().min(6).max(254),
  email: yup.string().required().email(),
  liked: yup.array().required(),
  disliked: yup.array().required(),
});

const signupInfoSchema = yup.object().shape({
  username: yup.string().required().min(3).max(16),
  password: yup.string().required().min(6).max(254),
  email: yup.string().required().email(),
});

const validateUser = async (user) => {
  return signupInfoSchema
    .validate(user, { abortEarly: false })
    .then(async (validatedUser) => {
      // check to see if username and email are unique
      try {
        let userbyUsername = await findUserbyUsername(validatedUser.username);

        let userbyEmail = await findUserbyEmail(validatedUser.email);

        if (userbyEmail && userbyUsername) {
          return { error: 'Email and username already taken!' };
        } else if (userbyEmail) {
          return { error: `Email already taken!` };
        } else if (userbyUsername) {
          return { error: 'Username already taken!' };
        }
      } catch (err) {
        return { error: 'Something went horribly wrong...' };
      }
    })
    .catch((err) => {
      return err;
    });
};

const signup = async (user) => {
  return signupSchema
    .validate(user, { abortEarly: false })
    .then(async (validatedUser) => {
      // check to see if username and email are unique
      try {
        let userbyUsername = await findUserbyUsername(validatedUser.username);

        let userbyEmail = await findUserbyEmail(validatedUser.email);

        if (userbyEmail && userbyUsername) {
          return { user: null, error: 'Email and username already taken!' };
        } else if (userbyEmail) {
          return { user: null, error: `Email already taken!` };
        } else if (userbyUsername) {
          return { user: null, error: 'Username already taken!' };
        }
      } catch (err) {
        return { user: null, error: 'Something went horribly wrong...' };
      }

      const hashedPassword = await argon.hash(user.password);
      // attempt to insert user into database
      return db
        .one(
          `INSERT INTO account(username, email, password, liked, disliked, saved)
                VALUES($1, $2, $3, $4, $5, $6)
                RETURNING id;`,
          [user.username, user.email, hashedPassword, [], [], []]
        )
        .then((res) => {
          logger.info(`Successfully added user ${user.username} to database.`);

          // attempt to like and dislike all the animes (perhaps find a better way to do this)
          for (let anime of user.liked) {
            sagasuService.likeAnime(anime, res.id);
          }

          for (let anime of user.disliked) {
            sagasuService.dislikeAnime(anime, res.id);
          }

          return { user: user, error: null };
        })
        .catch((err) => {
          logger.error(`Error inserting user: ${user.username}\n${err.stack}`);
          return { user: null, error: err };
        });
    })
    .catch((err) => {
      logger.error(`Error signing up user.\n${err}`);

      return { user: null, error: err };
    });
};

const findUserbyUsername = async (username) => {
  return db
    .oneOrNone(
      `SELECT id, username, password from account
                  WHERE lower(username) = lower($1)`,
      [username]
    )
    .then((user) => {
      return user;
    })
    .catch((err) => {
      logger.error(
        `Error querying for user through username ${username}.\n${err}`
      );
      throw new Error(`Error querying for user through username ${username}`);
    });
};

const findUserbyEmail = async (email) => {
  return db
    .oneOrNone(
      `SELECT id, username, password, email from account
                  WHERE lower(email) = lower($1)`,
      [email]
    )
    .then((user) => {
      return user;
    })
    .catch((err) => {
      logger.error(
        `Error querying for user through username ${username}.\n${err}`
      );
      throw new Error(`Error querying for user through username ${username}`);
    });
};

const findUserbyId = async (id) => {
  return db
    .oneOrNone(`SELECT id from account WHERE id = $1`, [id])
    .then((user) => {
      return user;
    })
    .catch((err) => {
      logger.error(`Error querying for user through id ${id}.\n${err}`);
      throw new Error(`Error querying for user through id ${id}.\n${err}`);
    });
};

module.exports = {
  validateUser: validateUser,
  signup: signup,
  findUserbyId: findUserbyId,
  findUserbyUsername: findUserbyUsername,
};
