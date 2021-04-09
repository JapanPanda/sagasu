import React from 'react';

import { Link } from '@reach/router';

import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';

import './home.css';

const Home = () => {
  const state = useGlobalState(globalState);
  const { loggedIn } = state.get();

  return (
    <div className='home'>
      <div className='header'>
        <h3>「さがす」</h3>
        <h1>Sagasu.</h1>
      </div>
      <div className='landing-body'>
        <p>
          Open-source machine-learning anime recommender, helping you find anime
          and your waifus.
        </p>

        {!loggedIn && (
          <div className='buttons'>
            <Link to='/signup'>
              <button>Sign Up</button>
            </Link>

            <Link to='/login'>
              <button>Log In</button>
            </Link>
          </div>
        )}

        {loggedIn && (
          <div className='buttons'>
            <Link to='/sagasu'>
              <button>Sagasu!</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
