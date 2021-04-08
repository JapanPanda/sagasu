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
      return res.status(400).json({ err: 'Not logged in' });
    }
    const recommended = await sagasuService.recommendAnime(req.user.id);
    if (recommended == null) {
      return res.status(400).json({ err: 'Something went wrong.' });
    }

    return res.status(200).json(recommended);
  });

  route.post('/like', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(400).json({ err: 'Not logged in' });
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

  route.post('/unlike', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(400).json({ err: 'Not logged in' });
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

  route.post('/dislike', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(400).json({ err: 'Not logged in' });
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

  route.post('/undislike', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(400).json({ err: 'Not logged in' });
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

  route.post('/save', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(400).json({ err: 'Not logged in' });
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

  route.post('/unsave', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(400).json({ err: 'Not logged in' });
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
