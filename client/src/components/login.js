import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { navigate } from '@reach/router';
import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const state = useGlobalState(globalState);
  const { loggedIn } = state.get();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '' && password === '') {
      state.flashMessage.set({
        title: 'Login Error',
        error: true,
        msg: 'Username and password are empty!',
      });
      state.showFlash.set(true);
      state.loggedIn.set(false);
    } else if (username === '') {
      state.flashMessage.set({
        title: 'Login Error',
        error: true,
        msg: 'Username is empty!',
      });
      state.showFlash.set(true);
      state.loggedIn.set(false);
    } else if (password === '') {
      state.flashMessage.set({
        title: 'Login Error',
        error: true,
        msg: 'Password is empty!',
      });
      state.showFlash.set(true);
      state.loggedIn.set(false);
    } else {
      state.loading.set(true);
      axios
        .post(
          '/api/user/login',
          {
            username: username,
            password: password,
            remember: remember,
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            state.loggedIn.set(true);
            state.loading.set(false);
            navigate('/');
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            console.error(err.response.data.msg);
            state.flashMessage.set({
              title: 'Login Error',
              error: true,
              msg: err.response.data.msg,
            });
            state.showFlash.set(true);
            state.loggedIn.set(false);
          } else {
            console.error(err);
          }
        });
    }
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn]);

  return (
    <div className='login'>
      <div className='header'>
        <h3>「おかえり」</h3>
        <h1>Log In</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='textinput'>
          <label>Username</label>
          <input
            type='text'
            value={username}
            onChange={(val) => setUsername(val.target.value)}
          />
        </div>

        <div className='textinput'>
          <label>Password</label>
          <input
            value={password}
            type='password'
            onChange={(val) => setPassword(val.target.value)}
          />
        </div>

        <div className='checkbox'>
          <input
            type='checkbox'
            id='checkbox'
            onChange={() => {
              setRemember(!remember);
            }}
            checked={remember}
          />
          <label htmlFor='checkbox'>
            <span>Remember Me</span>
          </label>
        </div>

        <input className='submit-button' type='submit' value='Login' />
      </form>
    </div>
  );
};

export default Login;
