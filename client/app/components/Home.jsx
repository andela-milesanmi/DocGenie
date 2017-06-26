import React from 'react';
import { Link } from 'react-router';
// import Header from './Header.jsx';
import SignUp from './SignUp.jsx';
import SignIn from './SignIn.jsx';


/**
* This is a pure function that receives properties as props parameter
* and is the parent component in which all other child components
* are displayed as "props.children".
* @param {object} props
* @returns a react element.
*/
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      isSignInScreen: true,
    };
    this.changeScreen = this.changeScreen.bind(this);
  }
  changeScreen() {
    this.setState({ isSignInScreen: !this.state.isSignInScreen });
  }
  renderSigninOrSignUp() {
    if (this.state.isSignInScreen) {
      return (<SignIn changeScreen={this.changeScreen} isSignInScreen={this.state.isSignInScreen} />);
    }
    return (<SignUp isSignInScreen={this.state.isSignInScreen} changeScreen={this.changeScreen} />);
  }
  render() {
    return (
      <div className="index-page container" style={{ textAlign: 'center' }}>
        <h4>Welcome to DocGenie</h4>
        <p>Docgenie allows you to manage your documents, easily!</p>
        <div>
          {this.renderSigninOrSignUp()}
        </div>
      </div>
    );
  }
}

export default Home;
