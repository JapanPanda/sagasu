import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './sagasuBar.css';

const SagasuBar = ({ handleLike, handleSave, handleSkip, handleDislike }) => {
  return (
    <div className='sagasu-bar'>
      <button onClick={handleLike} className='heart'>
        <FontAwesomeIcon icon='heart' />
      </button>
      <button onClick={handleSave} className='plus'>
        <FontAwesomeIcon icon='plus' />
      </button>
      <button onClick={handleSkip} className='meh'>
        <FontAwesomeIcon icon='meh' />
      </button>
      <button onClick={handleDislike} className='heart-broken'>
        <FontAwesomeIcon icon='heart-broken' />
      </button>
    </div>
  );
};

export default SagasuBar;
