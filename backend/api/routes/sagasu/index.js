const express = require('express');
const logger = require('../../../loaders/logger');
const route = express.Router();
const sagasuService = require('../../../services/sagasuService');

module.exports = (app) => {
  app.use('/sagasu', route);

  route.get('/', (req, res) => {
    return res.json({ res: 'sagasu' }).status(200);
  });

  route.get('/recommend', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    const recommended = await sagasuService.recommendAnime(req.user.id);
    if (recommended == null) {
      return res.status(400).json({ err: 'Something went wrong.' });
    }

    return res.status(200).json(recommended);
  });

  // get the liked animes
  route.get('/liked', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.getLikedAnimes(req.user.id, true);

      if (data == null) {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });

  // add to liked animes
  route.post('/like', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.likeAnime(req.body.mal_id, req.user.id);

      if (data == null || data[1] !== 'ok') {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });

  // remove from liked animes
  route.post('/unlike', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.unlikeAnime(
        req.body.mal_id,
        req.user.id
      );

      if (data == null || data[1] !== 'ok') {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });

  // get disliked animes
  route.get('/dislike', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.getDislikedAnimes(req.user.id, true);

      if (data == null) {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });

  // add to dislike list
  route.post('/dislike', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.dislikeAnime(
        req.body.mal_id,
        req.user.id
      );

      if (data == null || data[1] !== 'ok') {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });

  // remove from dislike list
  route.post('/undislike', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.undislikeAnime(
        req.body.mal_id,
        req.user.id
      );

      if (data == null || data[1] !== 'ok') {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });

  // get saved animes
  route.get('/save', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.getSavedAnimes(req.user.id, true);

      if (data == null) {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });

  // add to saved list
  route.post('/save', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.saveAnime(req.body.mal_id, req.user.id);

      if (data == null || data[1] !== 'ok') {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });

  // remove from saved list
  route.post('/unsave', async (req, res) => {
    if (!req.isAuthenticated()) {
      res.cookie('loggedIn', 'false', { maxAge: 0 });
      return res.status(400).json({ err: 'Not logged in' });
    }

    if (req.cookies !== undefined && !req.cookies['loggedIn']) {
      res.cookie('loggedIn', 'true', { maxAge: 3600000 * 24 * 138 });
    }

    try {
      const data = await sagasuService.unsaveAnime(
        req.body.mal_id,
        req.user.id
      );

      if (data == null || data[1] !== 'ok') {
        return res.status(400).json({ err: 'Something went wrong.' });
      }

      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Something went wrong.\n${err.stack}`);
      return res.status(400).json({ err: 'Something went wrong.' });
    }
  });
};
