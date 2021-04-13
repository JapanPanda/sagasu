import React from 'react';
import './filterResult.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FilterResult = ({ filtered, anime, addAnime, delAnime }) => {
  const selected = filtered.includes(anime.title);
  return (
    <li
      onClick={() => {
        if (selected) {
          delAnime(anime);
        } else {
          addAnime(anime);
        }
      }}
      className={`filter-result ${selected ? 'selected' : ''}`}>
      <div className='filter-result-image'>
        <img alt={anime.title} src={anime.image_url} />
      </div>

      <div className='filter-result-titles'>
        <h1 className='filter-result-title'>{anime.title}</h1>
        {anime.title_eng !== null && (
          <h4 className='filter-result-title-eng'>{anime.title_eng}</h4>
        )}
        <h4 className='filter-result-year'>(Premiered: {anime.year})</h4>
      </div>

      <div className='add-item'>
        {!selected && (
          <FontAwesomeIcon
            onClick={() => {
              addAnime(anime);
            }}
            className='add-icon'
            icon='plus'
          />
        )}
        {selected && (
          <FontAwesomeIcon
            onClick={() => {
              delAnime(anime);
            }}
            className='add-icon'
            icon='minus'
          />
        )}
      </div>
    </li>
  );
};

export default FilterResult;
