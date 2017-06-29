import React from 'react';
import { connect } from 'react-redux';
import { updateProfile } from '../actions/userActions';

class Profile extends React.Component {
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
  onChange(e) {
    const user = { ...this.state.user, [e.target.name]: e.target.value };
    this.setState({ user });
  }
  toggle(field) {
    this.setState({ [field]: !this.state[field] });
  }

  renderProfile() {
    if (!this.state.isEdit) {
      return (
        <div className="col s8 offset-s2" style={{ backgroundColor: '#fff' }}>
          <h4>Profile Information</h4>
          <p>Fullname: {this.state.user.fullname}</p>
          <p>Username: {this.state.user.username}</p>
          <p>Email: {this.state.user.email}</p>
          {(this.state.user.roleId === 1) ? <p>Role: Admin</p> : ''}
          <button type="submit" onClick={() => this.toggle('isEdit')}>Edit Profile</button>
        </div>
      );
    }
    return (
      <div className="col s8 offset-s2" style={{ backgroundColor: '#fff' }}>
        <h4>Edit Profile</h4>
        <form name="profile-edit" onSubmit={this.handleProfileUpdate} action="#">
          <div style={{ color: 'red' }}>{this.state.errorMessage || this.props.error}</div>
          <p>Fullname: <input type="text" name="fullname" value={this.state.user.fullname} onChange={this.onChange}/></p>
          <p>Username: <input type="text" name="username" value={this.state.user.username} onChange={this.onChange}/></p>
          <p>Email: <input type="text" name="email" value={this.state.user.email} onChange={this.onChange}/></p>
          <p>
              Change Password?
            <div className="switch">
              <label>
                Off
                <input type="checkbox" name="showPassword" checked={this.state.isChecked} onChange={() => this.toggle('isChecked')} />
                <span className="lever" />
                On
              </label>
            </div>
          </p>
          <p>{this.state.isChecked && (
            <div>
              <p>Old Password: <input type="password" name="oldPassword" onChange={this.onChange}/></p>
              <p>New Password: <input type="password" name="newPassword" onChange={this.onChange}/></p>
              <p>Confirm Password: <input type="password" name="confirmPassword" onChange={this.onChange} /></p>
            </div>
          )}</p>
          <button type="submit">Save</button>
          <button type="submit" onClick={() => this.toggle('isEdit')}>Cancel</button>
        </form>
      </div>
    );
  }

  handleProfileUpdate(event) {
    event.preventDefault();
    const { fullname: { value: fullname } = {}, username: { value: username } = {},
      email: { value: email } = {}, oldPassword: { value: oldPassword } = {},
      newPassword: { value: newPassword } = {}, confirmPassword: { value: confirmPassword } = {} } = event.target;
    console.log(fullname, username, email,
      oldPassword, newPassword, confirmPassword, 'update profile form data');
    if (newPassword || confirmPassword || oldPassword) {
      if (newPassword !== confirmPassword) {
        this.setState({ errorMessage: 'Passwords do not match' });
        return;
      }
    }
    this.props.updateProfile({ fullname, username, email, oldPassword, newPassword, confirmPassword });
  }

  render() {
    return (
      <div className="row">
        {this.renderProfile()}
      </div>
    );
  }
}
// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.documents
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
