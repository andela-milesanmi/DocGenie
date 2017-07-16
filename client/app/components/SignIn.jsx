import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signInUser } from '../actions/userActions';


/**
 * SignIn component
 * @export
 * @class SignIn
 * @extends {React.Component}
 */
export class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * OnSubmit function handles form-submit event
   * @param {any} event
   * @memberOf SignIn
   */
  onSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    this.props.signInUser({ email, password });
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
          <form className="signup-form"
            onSubmit={this.onSubmit} action="#">
            <div className="error-message">{this.props.user.error}</div>
            <div className="row">
              <div className="input-field col s12">
                <input name="email" id="email" type="text"
                  className="validate" required/>
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field col s12">
                <input name="password" id="password" type="password"
                  className="validate" required/>
                <label htmlFor="password">Password</label>
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-large create-doc
                signup-button">SUBMIT</button>
            </div>
            <div>
              <p className="center-align">Don't have an account yet?
                <a style={{ color: '#EE6352' }}
                  onClick={this.props.changeScreen}> Sign Up</a>
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

SignIn.propTypes = {
  changeScreen: PropTypes.func.isRequired,
  signInUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  error: PropTypes.string.isRequired
};

export default connect(mapStateToProps, { signInUser })(SignIn);
