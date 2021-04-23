import { createState } from '@hookstate/core';

const initialState = {
  loggedIn: false,
  loading: false,
  flashMessage: {
    title: '',
    msg: '',
    error: false,
  },
  showFlash: false,
};

const globalState = createState(initialState);
export default globalState;
