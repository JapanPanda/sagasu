import React from 'react';
import FilterResult from './filterResult';
import './filteredList.css';

const FilteredList = ({ results, filtered, addAnime, delAnime }) => {
  return (
    <ul
      className={`filtered-list ${
        results.length === 0 ? 'empty-filtered-list' : ''
      }`}>
      {results.length === 0 && (
        <h3 className='empty-message'>
          No anime found!
          <br />
          Search for another!
        </h3>
      )}
      {results.length > 0 &&
        results.map((result, i) => {
          return (
            <FilterResult
              filtered={filtered}
              key={i}
              anime={result}
              addAnime={addAnime}
              delAnime={delAnime}
            />
          );
        })}
    </ul>
  );
};

export default FilteredList;
