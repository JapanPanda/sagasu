import React, { useState, useEffect } from 'react';
import FilteredList from './filteredList';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AnimeList from './animeList';

const SignUpPart1 = ({ setPage, setPart1, part1 }) => {
  const [results, setResults] = useState([]);
  const [liked, setLiked] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (part1 !== null) {
      setLiked(part1);
    }
  }, [part1]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting');
    setPart1(liked);
    setPage(2);
  };

  const handleAdd = (anime) => {
    if (liked.filter((e) => e.title === anime.title).length > 0) {
      return;
    }

    const tmp = [...liked];
    tmp.push(anime);
    setLiked(tmp);
    setPart1(tmp);
  };

  const handleDel = (anime) => {
    let tmp = [...liked];
    if (anime.title !== undefined) {
      tmp = tmp.filter((item) => item.title !== anime.title);
    }
    setLiked(tmp);
    setPart1(tmp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(process.env.REACT_APP_SERVER_URL + '/api/anime/search', {
        params: { anime: query },
      })
      .then((res) => {
        // check if our response is an empty object or array
        setResults(Object.keys(res.data).length === 0 ? [] : res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <div className='header'>
        <h3>「好きなアニメ」</h3>
        <h1>Liked Anime</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='textinput'>
          <label>Search for your favorite anime</label>

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
          filtered={liked}
          addAnime={handleAdd}
          delAnime={handleDel}
        />

        <AnimeList empty_msg='liked' filtered={liked} delAnime={handleDel} />

        <button
          onClick={() => {
            setPage(0);
          }}>
          Back
        </button>

        <input className='submit-button' type='submit' value='Next' />
      </form>
    </div>
  );
};

export default SignUpPart1;
