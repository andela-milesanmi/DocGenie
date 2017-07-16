import React from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { updateProfile } from '../../actions/userActions';

/**
 * Pure function, UserRow
 * @param {object} props
 */
// let role;

export class UserRow extends React.Component {
  constructor(props) {
    super(props);
    this.roleObject = { admin: 1, user: 2 };
    this.state = {
      isEdit: false,
      role: ''
    };

    this.toggleIsEdit = this.toggleIsEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderRoleOption = this.renderRoleOption.bind(this);
  }

  componentWillMount() {
    const { user: { roleId } } = this.props;
    const roleObject = { 1: 'admin', 2: 'user' };
    this.setState({ role: roleObject[roleId] });
  }

  componentWillReceiveProps(nextProps) {
    const { user: { roleId } } = nextProps;
    const roleObject = { 1: 'admin', 2: 'user' };
    this.setState({ role: roleObject[roleId] });
  }

  toggleIsEdit() {
    this.setState({ isEdit: !this.state.isEdit });
  }

  handleSubmit(event) {
    event.preventDefault();
    const roleId = event.target.role.value;
    this.props.updateProfile({ roleId }, this.props.user.id).then(() => {
      toastr.success('User Role Updated!');
      this.toggleIsEdit();
    }).catch((error) => {
      toastr.error('Could not update profile');
    });
  }
  renderRoleOption() {
    if (this.state.isEdit) {
      return (<form onSubmit={this.handleSubmit}>
        <select name="role" className="browser-default"
          value={this.roleObject[this.state.role]} onChange={(e) => {
            this.setState({ role: e.target.value });
          }}>
          <option value="" disabled selected>Select user role</option>
          <option value="1">admin</option>
          <option value="2">user</option>
        </select>
        <button type="submit">Update</button>
      </form>);
    }
    return this.state.role;
  }

  render() {
    const { index, user } = this.props;
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{user.fullname}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{this.renderRoleOption()}</td>
        <td>
          <button
            className="btn update-role create-doc tooltipped"
            title="UPDATE ROLE" onClick={this.toggleIsEdit}>
            <i className="large material-icons">mode_edit</i>
          </button>
        </td>
      </tr>
    );
  }
}

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.searchForDocuments
    updateProfile: (user, id) => dispatch(updateProfile(user, id))
  };
};

UserRow.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  role: PropTypes.number.isRequired
};

export default connect(null, mapDispatchToProps)(UserRow);
