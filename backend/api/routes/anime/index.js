const express = require('express');
const logger = require('../../../loaders/logger');
const route = express.Router();

const animeService = require('../../../services/animeService');

module.exports = (app) => {
  app.use('/anime', route);

  route.get('/search', async (req, res) => {
    let query = req.query.anime;

    if (query === null) {
      return res.status(400).json({ msg: 'Invalid query' });
    }

    const result = await animeService.searchAnime(query);
    return res.status(200).json(result);
  });
};
