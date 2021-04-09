import { createState } from '@hookstate/core';

const initialState = {
  loggedIn: false,
  flashMessage: {
    title: '',
    msg: '',
    error: false,
  },
  showFlash: false,
};

const globalState = createState(initialState);
export default globalState;
