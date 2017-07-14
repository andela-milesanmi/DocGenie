import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { viewAllUsers } from '../actions/userActions';

/**
 * AllUsers component, renders all registered users for an admin user
 * @export
 * @class AllUsers
 * @extends {React.Component}
 */
export class AllUsers extends React.Component {
  /**
   * componentDidMount, React lifecyle method which is invoked once the
   * component mounts
   * @memberOf AllUsers
   */
  componentDidMount() {
    this.props.viewAllUsers(this.props.params.page);
  }

  /**
   * render, React lifecycle method
   * @returns a DOM element
   * @memberOf AllUsers
   */
  render() {
    return (
      <div className="container">
        <table className="col s8 responsive-table centered highlight
         all-users">
          <thead>
            <tr>
              <th>No.</th>
              <th>Fullname</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {this.props.users && this.props.users.map((user, i) => (
              <tr index={i}>
                <td>{i + 1}</td>
                <td>{user.fullname}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.roleId === 1 ? 'Admin' : 'User' }</td>
              </tr>
            )
            )}
          </tbody>
        </table>
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

AllUsers.propTypes = {
  viewAllUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);
