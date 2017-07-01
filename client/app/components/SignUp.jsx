import React from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { createUser, editUser } from '../actions/userActions';

/**
* This is a pure function that receives properties as props parameter
* and is the parent component in which all other child components
* are displayed as "props.children".
* @param {object} props
* @returns a react element.
*/
class SignUp extends React.Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const fullname = e.target.fullname.value;
    const email = e.target.email.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirm_password = e.target.confirm_password.value;
    this.props.createUser({ username, fullname, email, password, confirm_password });
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="signup-form col s6 push-s6" onSubmit={this.onSubmit} action="#">
            <div className="error-message">{this.props.user.error}</div>
            <div className="row">
              <div className="input-field col s6">
                <input name="username" id="username" type="text" className="validate" />
                <label htmlFor="username">Username</label>
              </div>
              <div className="input-field col s6">
                <input name="fullname" id="fullname" type="text" className="validate" />
                <label htmlFor="fullname">Fullname</label>
              </div>
              <div className="input-field col s12">
                <input name="email" id="email" type="text" className="validate" />
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <input name="password" id="password" type="password" className="validate"/>
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-field col s6">
                <input name="confirm_password" id="confirm_password" type="password" className="validate" />
                <label htmlFor="email">Confirm password</label>
              </div>
            </div>
            <div>
              <button type="submit" className="signup-button">SUBMIT</button>
            </div>

            <div>
              <p style={{ textAlign: 'center' }}>Already have an account?
                <a onClick={this.props.changeScreen}>Sign In</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.user
    user: state.user || {}
  };
};
export default connect(mapStateToProps, { createUser, editUser })(SignUp);
