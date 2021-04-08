import { createState } from '@hookstate/core';

const initialState = {
  loggedIn: false,
  flashMessage: '',
  showFlash: true,
};

const globalState = createState(initialState);
export default globalState;
