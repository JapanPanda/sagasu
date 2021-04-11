import React from 'react';

import './flashMessage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';

const FlashMessage = () => {
  const state = useGlobalState(globalState);
  const { flashMessage } = state.get();

  const handleClose = () => {
    state.showFlash.set(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className={`flash-message ${flashMessage.error ? 'error' : ''}`}>
        <div className='top-bar'>
          <span className='title'>{flashMessage.title}</span>
          <span className='close'>
            <FontAwesomeIcon
              style={{ cursor: 'pointer' }}
              onClick={handleClose}
              icon='times'
            />
          </span>
        </div>
        <div className='flash-body'>
          <p>{flashMessage.msg}</p>
        </div>
      </div>
    </div>
  );
};

export default FlashMessage;
