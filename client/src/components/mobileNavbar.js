import React, { useState } from 'react';
import { Link } from '@reach/router';
import './mobileNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState as useGlobalState } from '@hookstate/core';
import globalState from '../hookstate/globalState';
import Slide from 'react-reveal/Slide';

const MobileNavbar = ({ signOut }) => {
  const state = useGlobalState(globalState);
  const { loggedIn } = state.get();
  const [expand, setExpand] = useState(false);

  const expandMenu = () => {
    let currExpand = expand;
    setExpand(!currExpand);
  };

  const _signOut = () => {
    setExpand(false);
    signOut();
  };

  return (
    <div>
      <nav className='navbar'>
        <span className='navbar-logo'>Sagasu.</span>
        <span className='navbar-item'>
          <FontAwesomeIcon
            onClick={() => expandMenu()}
            className='hamburger-menu'
            icon='bars'
          />
        </span>
      </nav>
      {loggedIn && (
        <Slide top unmountOnExit duration={500} when={expand}>
          <nav className='expanded-navbar'>
            <div className='navbar-item'>Saved</div>
            <div className='navbar-item'>Likes</div>
            <div className='navbar-item'>Dislikes</div>
            <div className='navbar-item'>Account</div>
            <div className='navbar-item'>
              <Link to='/' onClick={_signOut}>
                Sign Out
              </Link>
            </div>
          </nav>
        </Slide>
      )}
      {!loggedIn && (
        <Slide top unmountOnExit duration={500} when={expand}>
          <nav className='expanded-navbar'>
            <div className='navbar-item'>
              <Link
                onClick={() => {
                  setExpand(false);
                }}
                to='/login'>
                Log In
              </Link>
            </div>
            <div className='navbar-item'>
              <Link
                onClick={() => {
                  setExpand(false);
                }}
                to='/signup'>
                Sign Up
              </Link>
            </div>
            <div className='navbar-item'>Github</div>
          </nav>
        </Slide>
      )}
    </div>
  );
};

export default MobileNavbar;
