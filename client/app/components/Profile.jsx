import React from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { updateProfile } from '../actions/userActions';

/**
 * User Profile component
 * @export
 * @class Profile
 * @extends {React.Component}
 */
export class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      isChecked: false,
      user: { ...props.user },
      errorMessage: ''
    };
    this.onChange = this.onChange.bind(this);
    this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
  }

  /**
   * onChange method handles form-input change event
   * @param {object} e, event
   * @memberOf Profile
   */
  onChange(e) {
    const user = { ...this.state.user, [e.target.name]: e.target.value };
    this.setState({ user });
  }

  /**
   * toggle method toggles state: isChecked and isEdit
   * @param {string} field
   * @memberOf Profile
   */
  toggle(field) {
    this.setState({ [field]: !this.state[field] });
  }

  /**
   * renderProfile method renders profile information or profile edit form
   * @returns DOM element
   * @memberOf Profile
   */
  renderProfile() {
    if (!this.state.isEdit) {
      return (
        <div className="">
          <h4>Profile Information</h4>
          <hr />
          <p><b>Fullname: </b>{this.state.user.fullname}</p>
          <p><b>Username: </b>{this.state.user.username}</p>
          <p><b>Email: </b>{this.state.user.email}</p>
          {(this.state.user.roleId === 1) ? <p><b>Role:</b> Admin</p> :
            <p><b>Role:</b> User</p>}
          <button className="btn btn-large create-doc" type="submit"
            onClick={() => this.toggle('isEdit')}>
            Edit Profile
          </button>
        </div>
      );
    }
    return (
      <div className="">
        <h4>Edit Profile</h4>
        <hr/>
        <form name="profile-edit" onSubmit={this.handleProfileUpdate} action="#">
          <div style={{ color: 'red' }}>
            {this.state.errorMessage || this.props.error}
          </div>
          <p><b>Fullname: </b> <input type="text" name="fullname"
            value={this.state.user.fullname} onChange={this.onChange}/>
          </p>
          <p><b>Username: </b> <input type="text" name="username"
            value={this.state.user.username} onChange={this.onChange}/>
          </p>
          <p><b>Email: </b> <input type="text" name="email"
            value={this.state.user.email} onChange={this.onChange}/>
          </p>
          <p>
            <b>Change Password? </b>
            <div className="switch">
              <label>
                Off
                <input type="checkbox" name="showPassword"
                  checked={this.state.isChecked}
                  onChange={() => this.toggle('isChecked')} />
                <span className="lever" />
                On
              </label>
            </div>
          </p>
          {this.state.isChecked && (
            <div>
              <p><b>Old Password: </b><input type="password" name="oldPassword"
                onChange={this.onChange}/>
              </p>
              <p><b>New Password: </b><input type="password" name="password"
                onChange={this.onChange}/>
              </p>
              <p><b>Confirm Password: </b><input type="password"
                name="confirmPassword"
                onChange={this.onChange} />
              </p>
            </div>
          )}
          <button type="submit" className="btn btn-large create-doc profile-save">
            Save</button>
          <button type="" className="btn btn-large create-doc profile-save"
            onClick={() => this.toggle('isEdit')}>Cancel</button>
        </form>
      </div>
    );
  }

  /**
   * handleProfileUpdate dispatches an updateProfile action
   * @param {object} event
   * @returns a DOM element
   * @memberOf Profile
   */
  handleProfileUpdate(event) {
    event.preventDefault();
    const { fullname: { value: fullname } = {},
      username: { value: username } = {},
      email: { value: email } = {},
      oldPassword: { value: oldPassword } = {},
      password: { value: password } = {},
      confirmPassword: { value: confirmPassword } = {} } = event.target;
    if (password || confirmPassword || oldPassword) {
      if (password !== confirmPassword) {
        this.setState({ errorMessage: 'Passwords do not match' });
        return;
      }
    }
    this.props.updateProfile({ fullname,
      username,
      email,
      oldPassword,
      password,
      confirmPassword }).then(() => {
      this.toggle('isEdit');
    });
  }

  /**
   * render, React lifecycle method
   * @returns a DOM element
   * @memberOf Profile
   */
  render() {
    return (
      <div className="container">
        <div className="row profile col sm 10 offset-s1">
          {this.renderProfile()}
        </div>
      </div>
    );
  }
}
// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.user
    user: state.user.currentProfile,
    currentDocument: state.documents.currentDocument || {},
    error: state.user.error
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.updateProfile
    updateProfile: user => dispatch(updateProfile(user))
  };
};

Profile.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  error: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
