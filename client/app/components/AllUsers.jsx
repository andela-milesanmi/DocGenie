import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { Navbar, Dropdown, NavItem, Icon } from 'react-materialize';
import { connect } from 'react-redux';
import { viewAllUsers } from '../actions/userActions';

class AllUsers extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.viewAllUsers(this.props.params.page);
  }

  render() {
    return (
      <div className="col s12" style={{ color: '#000' }}>
        <div className="row" style={{ fontSize: '15px' }}>
          {this.props.users && this.props.users.map((user, i) => (
            <ul className="collection col s8 offset-s2" index={i} style={{ backgroundColor: '#blue' }}>
              <li className="collection-item">{user.username}, {user.email}</li>
            </ul>
          )
          )}
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.user
    user: state.user.currentProfile || {},
    users: state.user.users
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.logoutUser
    viewAllUsers: page => dispatch(viewAllUsers(page)),
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);
