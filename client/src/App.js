import './App.css';
import React, { useEffect, useCallback } from 'react';
import { Router, navigate } from '@reach/router';

import { useState as useGlobalState } from '@hookstate/core';
import globalState from './hookstate/globalState';
import SignUp from './components/signUp';
import Login from './components/login';
import Home from './components/home';
import axios from 'axios';
import MobileNavbar from './components/mobileNavbar';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faTimes,
  faSearch,
  faPlus,
  faMinus,
  faHeart,
  faMeh,
  faHeartBroken,
} from '@fortawesome/free-solid-svg-icons';
import FlashMessage from './components/flashMessage';

import Fade from 'react-reveal/Fade';
import Sagasu from './components/sagasu';
import Loader from './components/loader';
import LikedAnime from './components/likedAnime';

library.add(
  faBars,
  faHeartBroken,
  faMeh,
  faHeart,
  faTimes,
  faSearch,
  faPlus,
  faMinus
);

const App = () => {
  const state = useGlobalState(globalState);
  const { loggedIn, showFlash, loading } = state.get();

  const signOut = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + '/api/user/logout', {
        withCredentials: true,
      })
      .then(() => {
        const tempState = state.loggedIn;
        tempState.set(false);
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const checkLoggedIn = useCallback(() => {
    const tempState = state.loggedIn;
    axios
      .get(process.env.REACT_APP_SERVER_URL + '/api/user/isLoggedIn', {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.loggedIn) {
          if (loggedIn !== true) {
            tempState.set(true);
          }
        } else {
          if (loggedIn !== false) {
            tempState.set(false);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (loggedIn) {
            tempState.set(false);
          }
        }
      });
  }, [loggedIn, state.loggedIn]);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return (
    <div className='App'>
      <MobileNavbar signOut={signOut} />
      <div className='flash'>
        <Fade duration={350} collapse unmountOnExit when={showFlash}>
          <FlashMessage />
        </Fade>
      </div>
      {loading && (
        <div className='loader-container'>
          <div className='loader'>
            <Loader />
          </div>
        </div>
      )}
      <Router>
        <Home path='/' />
        <Login path='/login' />
        <SignUp path='/signup' />
        <Sagasu path='/sagasu' />
        <LikedAnime path='/liked' />
      </Router>
    </div>
  );
};

export default App;
