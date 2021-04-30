import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import { navigate } from '@reach/router';

import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';
import UserAnimeList from './userAnimeList';

import './editWindow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DislikedAnime = () => {
  const [dislikedAnimeList, setDislikedAnimeList] = useState(null);
  const [editWindow, setEditWindow] = useState(false);
  const [editAnime, setEditAnime] = useState(null);

  const state = useGlobalState(globalState);

  const updateDislikedAnimeList = () => {
    state.loading.set(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + '/api/sagasu/dislike', {
        withCredentials: true,
      })
      .then((res) => {
        state.loading.set(false);
        setDislikedAnimeList(res.data);
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
    const updateDislikedAnimeListInit = async () => {
      setLoading(true);
      axios
        .get(process.env.REACT_APP_SERVER_URL + '/api/sagasu/dislike', {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          setDislikedAnimeList(res.data);
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

    updateDislikedAnimeListInit();
  }, [setLoading]);

  const toggleEditWindow = (anime) => {
    setEditWindow(!editWindow);
    setEditAnime(anime);
  };

  const handleUndislike = async (anime) => {
    return axios
      .post(
        process.env.REACT_APP_SERVER_URL + '/api/sagasu/undislike',
        { mal_id: anime.mal_id },
        { withCredentials: true }
      )
      .then((res) => {
        setEditWindow(false);
        // need to remove from list
        updateDislikedAnimeList();
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

  const handleSave = async (anime) => {
    state.loading.set(true);

    const pr1 = handleUndislike(anime);
    const pr2 = axios.post(
      process.env.REACT_APP_SERVER_URL + '/api/sagasu/save',
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

  const handleLike = (anime) => {
    state.loading.set(true);

    const pr1 = handleUndislike(anime);
    const pr2 = axios.post(
      process.env.REACT_APP_SERVER_URL + '/api/sagasu/like',
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
        <h3>「嫌いなアニメ」</h3>
        <h1>Disliked Anime</h1>
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
                    handleUndislike(editAnime);
                  }}>
                  Undislike
                </button>
                <button
                  onClick={() => {
                    handleLike(editAnime);
                  }}>
                  Like
                </button>
                <button
                  onClick={() => {
                    handleSave(editAnime);
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
      <UserAnimeList
        animes={dislikedAnimeList}
        toggleEditWindow={toggleEditWindow}
      />
    </div>
  );
};

export default DislikedAnime;
