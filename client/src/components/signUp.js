import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { navigate } from '@reach/router';
import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';

import './signUp.css';

import SignUpPart0 from './signUpPart0';
import SignUpPart1 from './signUpPart1';
import SignUpPart2 from './signUpPart2';

const SignUp = () => {
  const [page, setPage] = useState(0);
  const [part0, setPart0] = useState(null);
  const [part1, setPart1] = useState(null);
  const [part2, setPart2] = useState(null);

  const state = useGlobalState(globalState);
  const { loggedIn } = state.get();

  const submit = () => {
    axios
      .post('/api/user/signup', {
        username: part0.username,
        email: part0.email,
        password: part0.password,
        liked: part1 === null ? [] : part1.map((anime) => anime.mal_id),
        disliked: part2 === null ? [] : part2.map((anime) => anime.mal_id),
      })
      .then((res) => {
        if (res.data.error === undefined) {
          state.flashMessage.set({
            msg: `${part0.username} has been signed up successfully!`,
            title: 'Successful Sign Up',
            error: false,
          });
          state.showFlash.set(true);

          navigate('/login');
        } else {
          console.error(res.data.error);
        }
      })
      .catch((err) => {
        state.flashMessage.set({
          title: 'Signup Error',
          error: true,
          msg: 'Something went wrong...',
        });
        state.showFlash.set(true);
        state.loggedIn.set(false);
        console.error(err);
      });
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn]);

  return (
    <div className='signup'>
      {page === 0 && (
        <SignUpPart0 part0={part0} setPart0={setPart0} setPage={setPage} />
      )}
      {page === 1 && (
        <SignUpPart1 part1={part1} setPart1={setPart1} setPage={setPage} />
      )}
      {page === 2 && (
        <SignUpPart2
          submit={submit}
          part2={part2}
          setPart2={setPart2}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default SignUp;
