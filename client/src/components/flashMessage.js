import React from 'react';

import './flashMessage.css';

const FlashMessage = () => {
  return (
    <div className='flash-message'>
      <div className='top-bar'></div>
      <div className='body'>Incorrect credentials were used!</div>
    </div>
  );
};

export default FlashMessage;
