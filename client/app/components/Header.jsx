import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { Navbar, Dropdown, NavItem, Icon } from 'react-materialize';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { logoutUser, viewUserProfile } from '../actions/userActions';

class Header extends React.Component {
  constructor() {
    super();

    this.state = {
      isAdmin: false
    };

    // this.viewUserProfile = this.viewUserProfile.bind(this);
  }

  // viewUserProfile() {
  // }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const roleId = jwt(token).roleId;
    if (roleId === 1) {
      this.setState({ isAdmin: true });
    }
  }

  render() {
    const { user } = this.props;
    return (
      <Navbar id="nav" brand="DocGenie" className="nav-logo" right>
        {user.id && <Dropdown
          className="col s4 nav-dropdown-content"
          style={{ backgroundColor: '#ccc' }}
          trigger={
            <NavItem id="more_vert" href="#!">
              <Icon>more_vert</Icon>
            </NavItem>
          }
        >
          <div className="nav-drop-div">
            <ul className="nav-dropdown-list logout" style={{ marginLeft: '10%' }}>
              @{user.username}
            </ul>
            <ul className="nav-dropdown-list">
              <Link to="/dashboard/profile" style={{ color: '#000' }}>
                Profile
              </Link>
            </ul>
            {this.state.isAdmin && <ul className="nav-dropdown-list">
              <Link to="/dashboard/profile" style={{ color: '#000' }}>Manage Users</Link>
            </ul>}
            <ul>
              <Link className="logout" to="#" onClick={() => {
                this.props.logoutUser();
                localStorage.removeItem('token');
                browserHistory.replace('/');
              }}>LOGOUT
              </Link>
            </ul>
          </div>
        </Dropdown>}
      </Navbar>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.documents
    user: state.user.currentProfile
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createDocument
    logoutUser: () => dispatch(logoutUser())
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Header);
