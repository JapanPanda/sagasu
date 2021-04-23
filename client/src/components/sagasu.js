import React, { useState, useEffect } from 'react';

import axios from 'axios';

import './sagasu.css';
import SagasuBar from './sagasuBar';
import { navigate } from '@reach/router';

import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';

const Sagasu = () => {
  const [currentAnime, setCurrentAnime] = useState(null);

  const state = useGlobalState(globalState);

  const getNextRecommendation = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + '/api/sagasu/recommend', {
        withCredentials: true,
      })
      .then((res) => {
        setCurrentAnime(res.data[0]);
        state.loading.set(false);
      })
      .catch((err) => {
        navigate('/login');
      });
  };

  useEffect(() => {
    state.loading.set(true);
    getNextRecommendation();
  }, []);

  const handleLike = () => {
    state.loading.set(true);
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + '/api/sagasu/like',
        { mal_id: currentAnime.mal_id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data[1] !== null && res.data[1] === 'ok') {
          // move on
          getNextRecommendation();
        } else {
          // error
          console.error(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate('/');
      });
  };

  const handleSave = () => {
    state.loading.set(true);
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + '/api/sagasu/save',
        { mal_id: currentAnime.mal_id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data[1] !== null && res.data[1] === 'ok') {
          // move on
          getNextRecommendation();
        } else {
          // error
          console.error(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate('/');
      });
  };

  const handleSkip = () => {
    state.loading.set(true);
    getNextRecommendation();
  };

  const handleDislike = () => {
    state.loading.set(true);
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + '/api/sagasu/dislike',
        { mal_id: currentAnime.mal_id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data[1] !== null && res.data[1] === 'ok') {
          // move on
          getNextRecommendation();
        } else {
          // error
          console.error(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate('/');
      });
  };

  return (
    <div style={{ width: '100%' }}>
      {currentAnime !== null && (
        <div className='anime-card'>
          <div className='anime-image'>
            <img alt={currentAnime.image_url} src={currentAnime.image_url} />
          </div>
          <div className='anime-info'>
            <div className='anime-title'>
              <h3>{currentAnime.title}</h3>
              {currentAnime.title_eng !== null && (
                <h5>({currentAnime.title_eng})</h5>
              )}
            </div>

            <div className='anime-meta'>
              <p>Information</p>
              <p>Type: {currentAnime.type}</p>
              <p>Episodes: {currentAnime.episodes}</p>
              <p>Premiered: {currentAnime.premiered}</p>
              <p>Studio(s): {currentAnime.studio.join(', ')}</p>
            </div>

            <div className='anime-synopsis'>
              <p>Synopsis</p>
              <p>{currentAnime.synopsis}</p>
            </div>

            <div className='anime-rankings'>
              <div className='anime-ranking-column'>
                <h4>Rating</h4>
                <h5>{currentAnime.score}</h5>
              </div>
              <div className='anime-ranking-column'>
                <h4>Ranked</h4>
                <h5>#{currentAnime.ranked}</h5>
              </div>
              <div className='anime-ranking-column'>
                <h4>Popularity</h4>
                <h5>#{currentAnime.popularity}</h5>
              </div>
            </div>

            <div className='anime-genres'>
              {currentAnime.genres.map((genre) => {
                return <span>{genre}</span>;
              })}
            </div>

            <div className='anime-buttons'>
              <a
                target='_blank'
                href={currentAnime.mal_url}
                rel='noreferrer noopener'
                className='anime-mal-button'>
                MyAnimeList
              </a>
              <a
                target='_blank'
                href={currentAnime.anilist_url}
                rel='noreferrer noopener'
                className='anime-anilist-button'>
                AniList
              </a>
            </div>
          </div>
        </div>
      )}
      {currentAnime !== null && (
        <SagasuBar
          handleLike={handleLike}
          handleSave={handleSave}
          handleSkip={handleSkip}
          handleDislike={handleDislike}
        />
      )}
    </div>
  );
};

export default Sagasu;
