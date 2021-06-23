import React, { useState, useEffect } from 'react';
import FilteredList from './filteredList';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AnimeList from './animeList';

const SignUpPart2 = ({ submit, setPage, setPart2, part2 }) => {
  const [results, setResults] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (part2 !== null) {
      setDisliked(part2);
    }
  }, [part2]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPart2(disliked);
    submit();
  };

  const handleAdd = (anime) => {
    if (disliked.filter((e) => e.title === anime.title).length > 0) {
      return;
    }

    const tmp = [...disliked];
    tmp.push(anime);
    setDisliked(tmp);
    setPart2(tmp);
  };

  const handleDel = (anime) => {
    let tmp = [...disliked];
    if (anime.title !== undefined) {
      tmp = tmp.filter((item) => item.title !== anime.title);
    }
    setDisliked(tmp);
    setPart2(tmp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(process.env.REACT_APP_SERVER_URL + '/api/anime/search', {
        params: { anime: query },
      })
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <div className='header'>
        <h3>「嫌いななアニメ」</h3>
        <h1>Disliked Anime</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='textinput'>
          <label>Search for your disliked anime</label>

          <div className='search-input-container'>
            <input
              type='text'
              placeholder='Konosuba'
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
            <button onClick={handleSearch}>
              <FontAwesomeIcon icon='search' />
            </button>
          </div>
        </div>

        <FilteredList
          results={results}
          filtered={disliked}
          addAnime={handleAdd}
          delAnime={handleDel}
        />

        <AnimeList
          empty_msg='disliked'
          filtered={disliked}
          delAnime={handleDel}
        />

        <button
          onClick={() => {
            setPage(1);
          }}>
          Back
        </button>

        <input className='submit-button' type='submit' value='Next' />
      </form>
    </div>
  );
};

export default SignUpPart2;
