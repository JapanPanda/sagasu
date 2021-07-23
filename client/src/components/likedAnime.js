import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import { navigate } from '@reach/router';

import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';
import UserAnimeList from './userAnimeList';

import './editWindow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LikedAnimeList = () => {
  const [likedAnimes, setLikedAnimes] = useState(null);
  const [editWindow, setEditWindow] = useState(false);
  const [editAnime, setEditAnime] = useState(null);

  const state = useGlobalState(globalState);

  const updateLikedAnimes = () => {
    state.loading.set(true);
    axios
      .get('/api/sagasu/like', {
        withCredentials: true,
      })
      .then((res) => {
        state.loading.set(false);
        setLikedAnimes(res.data);
      })
      .catch((err) => {
        state.loading.set(false);
        if (err.response && err.response.status === 400) {
          navigate('/login');
        } else {
          console.error(err);
        }
      });
  };

  // TODO: fix the infinite loop once we add the state.loading dependency
  // github issues state that it's okay to not add it because its guaranteed to be fresh
  const setLoading = useCallback((bool) => {
    state.loading.set(bool);
  }, []);

  useEffect(() => {
    const updateLikedAnimesInit = async () => {
      setLoading(true);
      axios
        .get('/api/sagasu/like', {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          setLikedAnimes(res.data);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response && err.response.status === 400) {
            state.loggedIn.set(false);
            navigate('/login');
          } else {
            console.error(err);
          }
        });
    };

    updateLikedAnimesInit();
  }, [setLoading]);

  const toggleEditWindow = (anime) => {
    setEditWindow(!editWindow);
    setEditAnime(anime);
  };

  const handleUnlike = async (anime) => {
    return axios
      .post(
        '/api/sagasu/unlike',
        { mal_id: anime.mal_id },
        { withCredentials: true }
      )
      .then((res) => {
        setEditWindow(false);
        // need to remove from list
        updateLikedAnimes();
      })
      .catch((err) => {
        console.error(err);
        state.flashMessage.set({
          title: 'Edit Anime Error',
          error: true,
          msg: 'Something went wrong...',
        });
        state.showFlash.set(true);
        setEditWindow(false);
      });
  };

  const handleDislike = async (anime) => {
    state.loading.set(true);

    const pr1 = handleUnlike(anime);
    const pr2 = axios.post(
      '/api/sagasu/dislike',
      { mal_id: anime.mal_id },
      { withCredentials: true }
    );

    Promise.all([pr1, pr2])
      .then((values) => {
        setEditWindow(false);
        state.loading.set(false);
      })
      .catch((err) => {
        state.loading.set(false);
        console.error(err);
        state.flashMessage.set({
          title: 'Edit Anime Error',
          error: true,
          msg: 'Something went wrong...',
        });
        state.showFlash.set(true);
        setEditWindow(false);
      });
  };

  const handleSaved = (anime) => {
    state.loading.set(true);

    const pr1 = handleUnlike(anime);
    const pr2 = axios.post(
      '/api/sagasu/save',
      { mal_id: anime.mal_id },
      { withCredentials: true }
    );

    Promise.all([pr1, pr2])
      .then((values) => {
        setEditWindow(false);
        state.loading.set(false);
      })
      .catch((err) => {
        state.loading.set(false);
        console.error(err);
        state.flashMessage.set({
          title: 'Edit Anime Error',
          error: true,
          msg: 'Something went wrong...',
        });
        state.showFlash.set(true);
        setEditWindow(false);
      });
  };

  return (
    <div>
      <div className='header'>
        <h3>「好きなアニメ」</h3>
        <h1>Liked Anime</h1>
      </div>
      {/* ideally editWindow should be its own component, but it's easier to keep merge for the customizable options */}
      {editWindow && (
        <div className='edit-window-container'>
          <div className='edit-window'>
            <div className='edit-window-top'>
              <span className='title'>Edit Anime</span>
              <span className='close'>
                <FontAwesomeIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setEditWindow(false);
                  }}
                  icon='times'
                />
              </span>
            </div>

            <div className='edit-window-body'>
              <li className='user-anime-entry edit-anime'>
                <div className='user-anime-image'>
                  <img alt={editAnime.title} src={editAnime.image_url} />
                </div>
                <div className='user-anime-info'>
                  <h3>{editAnime.title}</h3>
                  <h5>({editAnime.title_eng})</h5>
                </div>
              </li>

              <div className='edit-button-group'>
                <button
                  onClick={() => {
                    handleUnlike(editAnime);
                  }}>
                  Unlike
                </button>
                <button
                  onClick={() => {
                    handleDislike(editAnime);
                  }}>
                  Dislike
                </button>
                <button
                  onClick={() => {
                    handleSaved(editAnime);
                  }}>
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditWindow(false);
                  }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <UserAnimeList animes={likedAnimes} toggleEditWindow={toggleEditWindow} />
    </div>
  );
};

export default LikedAnimeList;
