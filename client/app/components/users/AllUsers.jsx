import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchUsers from './SearchUsers.jsx';
import UserRow from './UserRow.jsx';
import { viewAllUsers } from '../../actions/userActions';

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
   * componentWillReceiveProps, React lifecycle method which is called once a
   * component receives next props, in this case: next page
   * @param {object} nextProps
   * @memberOf AllUsers
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.params.page !== nextProps.params.page) {
      this.props.viewAllUsers(this.props.params.page);
    }
  }

  /**
   * render, React lifecycle method
   * @returns a DOM element
   * @memberOf AllUsers
   */
  render() {
    return (
      <div className="container">
        <h4 className="center-align">ALL USERS</h4>
        <SearchUsers />
        <div className="col s12 all-users">
          <table className="responsive-table striped centered
         all-users">
            <thead>
              <tr>
                <th>No.</th>
                <th>Fullname</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.props.users.map(({ ...rest, role }, i) => (
                <UserRow user={rest} role={role} key={rest.fullname} index={i} />
              )
              )}
            </tbody>
          </table>
        </div>
        {this.props.users && this.props.users.length === 0 &&
          <div className="center-align">
            <h5>Aww shucks...No users found
            </h5>
          </div>
        }
        {/* pagination */}
        <div className="row paginate-docs">
          <ul className="pagination">
            {this.props.currentPage > 1 && <li><a href="#"
              onClick={() => {
                browserHistory.push(`/dashboard/users/${this.props.currentPage - 1}`);
              }}><i className="material-icons">chevron_left</i></a></li> }
            {Array(this.props.pages).fill(0).map((value, i) => {
              return (<li><a href="#" onClick={() => {
                browserHistory.push(`/dashboard/users/${i + 1}`);
              }}>{i + 1}</a></li>);
            })}
            {this.props.currentPage < this.props.pages &&
               <li className="waves-effect"><a href="#" onClick={() => {
                 browserHistory.push(`/dashboard/users/${this.props.currentPage + 1}`);
               }}><i className="material-icons">chevron_right</i></a></li> }
          </ul>
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = ({ user: { users, pages, currentProfile, currentPage } }) => {
  return {
    user: currentProfile || {},
    users: users || [],
    pages,
    currentPage,
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
  currentPage: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);
