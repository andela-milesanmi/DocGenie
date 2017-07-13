import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { Navbar, Dropdown, NavItem, Icon } from 'react-materialize';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/userActions';

const displayAllDocuments = () => {
  browserHistory.replace('/dashboard/documents/all');
};

const displayOwnDocuments = () => {
  browserHistory.replace('/dashboard/documents');
};
/**
 * pure function Header, renders the navigation bar
 * @params {object} props
 */
export const Header = (props) => {
  const { user } = props;
  return (
    <Navbar id="nav" brand="DocGenie" className="nav-logo" right>
      {user.id && <NavItem onClick={displayAllDocuments}>All Documents</NavItem>}
      {user.id && <NavItem onClick={displayOwnDocuments}>My Documents</NavItem>}
      {user.id && <NavItem className="chip chip-style">Welcome, @{user.username}</NavItem>}
      {user.id && <Dropdown
        className="col s4 nav-dropdown-content"
        trigger={
          <NavItem id="more_vert" href="#!">
            <Icon>more_vert</Icon>
          </NavItem>
        }
      >
        <div className="nav-drop-div">
          <ul className="nav-dropdown-list logout"
            style={{ marginLeft: '10%' }}>
              @{user.username}
          </ul>
          <ul className="nav-dropdown-list">
            <Link to="/dashboard/profile" style={{ color: '#000' }}>
                Profile
            </Link>
          </ul>
          {(user.roleId === 1) && <ul className="nav-dropdown-list">
            <Link to="/dashboard/users" style={{ color: '#000' }}>
              Manage Users
            </Link>
          </ul>}
          <ul>
            <Link className="logout" id="logoutLink" to="#" onClick={() => {
              props.logoutUser();
              localStorage.removeItem('token');
              browserHistory.replace('/');
            }}>LOGOUT
            </Link>
          </ul>
        </div>
      </Dropdown>}
    </Navbar>
  );
};


// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.user
    user: state.user.currentProfile || {}
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.logoutUser
    logoutUser: () => dispatch(logoutUser())
  };
};

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Header);
