import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/userActions';


const Header = ({ user, logoutUser }) => (
  <nav>
    <div className="main-nav nav-wrapper">
      <a href="/" className="brand-logo">DocGenie</a>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li>{user.id && <button type="submit" href="#" onClick={() => {
          logoutUser();
          localStorage.removeItem('token');
          browserHistory.replace('/');
        }}>LOGOUT</button>}</li>
      </ul>
    </div>
  </nav>

);
const mapStateToProps = ({ user = {} }) => ({ user });
export default connect(mapStateToProps, { logoutUser })(Header);
