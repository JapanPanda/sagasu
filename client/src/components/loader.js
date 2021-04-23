import React from 'react';

import './loader.css';

const Loader = () => {
  // loader taken from https://loading.io/css/
  return (
    <div class='lds-heart'>
      <div></div>
    </div>
  );
};

export default Loader;
