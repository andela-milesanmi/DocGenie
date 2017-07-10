import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createUser } from '../actions/userActions';

/**
 *
 * SignUp component
 * @export
 * @class SignUp
 * @extends {React.Component}
 */
export class SignUp extends React.Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * OnSubmit function handles form submission
   * @param {object} e, event
   * @memberOf SignUp
   */
  onSubmit(e) {
    e.preventDefault();
    const fullname = e.target.fullname.value;
    const email = e.target.email.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    this.props.createUser({ username, fullname, email, password, confirmPassword });
  }

  /**
   * React lifecycle method
   * @returns a DOM element
   * @memberOf SignUp
   */
  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="signup-form" onSubmit={this.onSubmit} action="#">
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
                <input name="confirmPassword" id="confirmPassword" type="password" className="validate" />
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

SignUp.propTypes = {
  changeScreen: PropTypes.func.isRequired,
  createUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  error: PropTypes.string.isRequired
};

export default connect(mapStateToProps, { createUser })(SignUp);
