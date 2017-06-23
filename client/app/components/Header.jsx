import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

const Header = () => (
  <nav>
    <div className="main-nav nav-wrapper">
      <a href="/" className="brand-logo">DocGenie</a>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        {/* <li><a href="sass.html">Sass</a></li>*/}
      </ul>
    </div>
  </nav>

);

export default Header;
