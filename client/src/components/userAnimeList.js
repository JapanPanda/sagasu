import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import './userAnimeList.css';

const UserAnimeList = ({ animes, toggleEditWindow }) => {
  return (
    <ul className='user-anime-list'>
      {animes !== null &&
        animes.map((anime, i) => {
          return (
            <li className='user-anime-entry' key={i}>
              <div className='user-anime-image'>
                <img alt={anime.title} src={anime.image_url} />
              </div>
              <div className='user-anime-info'>
                <h3>{anime.title}</h3>
                <h5>({anime.title_eng})</h5>
              </div>
              <div className='user-anime-modify'>
                <FontAwesomeIcon
                  className='user-anime-modify-icon'
                  onClick={() => {
                    toggleEditWindow(anime);
                  }}
                  icon='edit'
                />
              </div>
            </li>
          );
        })}
      {animes !== null && animes.length === 0 && (
        <h3>
          No anime here yet!
          <br />
          Go to /sagasu to find anime!
        </h3>
      )}
    </ul>
  );
};

export default UserAnimeList;
