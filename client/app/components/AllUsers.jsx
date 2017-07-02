import React from 'react';
import PropTypes from 'prop-types';
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
          <ul className="collection col s8 offset-s2" style={{ backgroundColor: '#blue' }}>
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
