import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './animeList.css';

const AnimeList = ({ filtered, delAnime, empty_msg }) => {
  useEffect(() => {}, [filtered]);
  return (
    <ul
      key={filtered}
      className={`anime-list ${
        filtered.length === 0 ? 'empty-anime-list' : ''
      }`}>
      {filtered.length === 0 && (
        <h4 className='empty-anime-message'>
          No {empty_msg} anime so far.
          <br />
          Add some!
        </h4>
      )}
      {filtered.length > 0 &&
        filtered.map((anime) => {
          return (
            <li key={anime.title} className='anime-list-entry'>
              <div className='anime-list-title'>
                <h3>{anime.title}</h3>
              </div>
              <div className='anime-list-remove'>
                <FontAwesomeIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    delAnime(anime);
                  }}
                  icon='times'
                />
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default AnimeList;
