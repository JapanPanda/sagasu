import React, { useState, useEffect } from 'react';

import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';
import axios from 'axios';

const SignUpPart0 = ({ setPage, setPart0, part0 }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (part0 !== null) {
      setUsername(part0.username);
      setEmail(part0.email);
    }
  }, [part0]);

  const state = useGlobalState(globalState);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        '/api/user/validateSignup',
        {
          username: username,
          password: password,
          email: email,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (!agree) {
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
          setPart0({ username: username, email: email, password: password });
          setPage(1);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 400) {
          console.error(err.response.data);
          state.flashMessage.set({
            title: 'Signup Error',
            error: true,
            msg: err.response.data.msg,
          });
          state.showFlash.set(true);
          state.loggedIn.set(false);
        }
      });
  };

  return (
    <div>
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

        <input className='submit-button' type='submit' value='Next' />
      </form>
    </div>
  );
};

export default SignUpPart0;
