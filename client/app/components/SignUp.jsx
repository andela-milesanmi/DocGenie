import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createUser } from '../actions/userActions';

/**
* @description - SignUp component, signs up a user into the app
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
  * @description - This handles signup form submission when a user signs up
  * @param {object} event - event data: username, fullname, email, password
  * @memberOf SignUp
  */
  onSubmit(event) {
    event.preventDefault();
    const { fullname: { value: fullname },
      username: { value: username },
      email: { value: email },
      password: { value: password },
      confirmPassword: { value: confirmPassword } } = event.target;
    this.props.createUser({ username,
      fullname,
      email,
      password,
      confirmPassword });
  }

  /**
  * @description - React lifecycle method which renders react element
  * @returns a DOM element
  * @memberOf SignUp
  */
  render() {
    return (
      <div className="container">
        <div className="row">
          <form id="signup-form" className="signup-form"
            onSubmit={this.onSubmit} action="#">
            <div className="error-message">{this.props.user.error}</div>
            <div className="row">
              <div className="input-field col s6">
                <input name="username" id="username" type="text"
                  className="validate" required/>
                <label htmlFor="username">Username</label>
              </div>
              <div className="input-field col s6">
                <input name="fullname" id="fullname" type="text"
                  className="validate" required/>
                <label htmlFor="fullname">Fullname</label>
              </div>
              <div className="input-field col s12">
                <input name="email" id="email" type="text"
                  className="validate" required/>
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <input name="password" id="password" type="password"
                  className="validate" required/>
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-field col s6">
                <input name="confirmPassword" id="confirmPassword"
                  type="password" className="validate" required/>
                <label htmlFor="email">Confirm password</label>
              </div>
            </div>
            <div>
              <button id="signup-button" type="submit"
                className="btn btn-large create-doc
               signup-button">SUBMIT</button>
            </div>

            <div>
              <p id="signup-text" className="center-align">
                Already have an account?
                <a style={{ color: '#EE6352' }}
                  onClick={this.props.changeScreen}>Sign In</a>
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
