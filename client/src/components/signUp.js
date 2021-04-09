import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { navigate } from '@reach/router';
import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';
import './login.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);

  const state = useGlobalState(globalState);
  const { loggedIn } = state.get();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      username === '' ||
      password === '' ||
      confirmPassword === '' ||
      email === ''
    ) {
      state.flashMessage.set({
        title: 'Signup Error',
        error: true,
        msg: 'Please fill out all the fields.',
      });
      state.showFlash.set(true);
      state.loggedIn.set(false);
    } else if (!agree) {
      state.flashMessage.set({
        title: 'Signup Error',
        error: true,
        msg: 'Please agree to the terms and services in order to sign up.',
      });
      state.showFlash.set(true);
      state.loggedIn.set(false);
    } else if (password !== confirmPassword) {
      state.flashMessage.set({
        title: 'Signup Error',
        error: true,
        msg: 'Passwords are not matching!',
      });
      state.showFlash.set(true);
      state.loggedIn.set(false);
    } else {
      axios
        .post(
          process.env.REACT_APP_SERVER_URL + '/api/user/signup',
          {
            username: username,
            password: password,
            email: email,
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            state.flashMessage.set({
              title: 'Signup Successful',
              error: false,
              msg:
                'You have successfully signed up! Please check your e-mail to confirm your registration.',
            });
            state.showFlash.set(true);
            state.loggedIn.set(false);
            navigate('/login');
          }
        })
        .catch((err) => {
          console.error(err);
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
        <h3>「ようこそ」</h3>
        <h1>Sign Up</h1>
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
          <label>E-mail</label>
          <input
            value={email}
            type='email'
            onChange={(val) => setEmail(val.target.value)}
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

        <div className='textinput'>
          <label>Confirm Password</label>
          <input
            value={confirmPassword}
            type='password'
            onChange={(val) => setConfirmPassword(val.target.value)}
          />
        </div>

        <div className='checkbox'>
          <input
            type='checkbox'
            id='checkbox'
            onChange={() => {
              setAgree(!agree);
            }}
            checked={agree}
          />
          <label htmlFor='checkbox'>
            <span>
              I agree to the <u>terms and services</u>.
            </span>
          </label>
        </div>

        <input className='submit-button' type='submit' value='Sign Up' />
      </form>
    </div>
  );
};

export default SignUp;
