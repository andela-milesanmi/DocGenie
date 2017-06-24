import React from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { signInUser } from '../actions/userActions';

/**
* This is a pure function that receives properties as props parameter
* and is the parent component in which all other child components
* are displayed as "props.children".
* @param {object} props
* @returns a react element.
*/
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    // console.log('got here at all?', this.props.createUser, 'got here??');
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    this.props.signInUser({ email, password });
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="signup-form col s8 push-s6" onSubmit={this.onSubmit} action="#">
            <div className="error-message">{this.props.user.error}</div>
            <div className="row">
              <div className="input-field col s12">
                <input name="email" id="email" type="text" className="validate" />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field col s12">
                <input name="password" id="password" type="password" className="validate" />
                <label htmlFor="password">Password</label>
              </div>
            </div>
            <div>
              <button type="submit" className="signup-button">SUBMIT</button>
            </div>
            <div>
              <p style={{ textAlign: 'center' }}>Don't have an account yet?
                <a onClick={this.props.changeScreen}> Sign Up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
// const mapStateToProps
// const mapDispatchToProps
// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.books
    user: state.user
  };
};
export default connect(mapStateToProps, { signInUser })(SignIn);
