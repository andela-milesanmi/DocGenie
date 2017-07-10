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
      <div className="col s12">
        <div className="row" style={{ fontSize: '15px' }}>
          <ul className="collection col s8 offset-s2">
            {this.props.users && this.props.users.map((user, i) => (
              <li index={i} className="collection-item">{user.username}, {user.email}</li>
            )
            )}
          </ul>
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

AllUsers.propTypes = {
  viewAllUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);
