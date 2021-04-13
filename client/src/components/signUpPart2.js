import React, { useState, useEffect } from 'react';
import FilteredList from './filteredList';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AnimeList from './animeList';

const SignUpPart2 = ({ setPage, setPart2, part2 }) => {
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
  };

  const handleAdd = (anime) => {
    if (disliked.includes(anime.title)) {
      return;
    }
    const tmp = [...disliked];
    tmp.push(anime.title);
    setDisliked(tmp);
  };

  const handleDel = (anime) => {
    let tmp = [...disliked];
    if (anime.title !== undefined) {
      tmp = tmp.filter((item) => item !== anime.title);
    } else {
      // for animeList deletion
      tmp = tmp.filter((item) => item !== anime);
      console.log(tmp);
    }
    setDisliked(tmp);
  };

  const handleSearch = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + '/api/anime/search', {
        params: { anime: query },
      })
      .then((res) => {
        console.log(res.data);
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
                  e.preventDefault();
                  handleSearch();
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
