import React from 'react';
import SignUp from './SignUp.jsx';
import SignIn from './SignIn.jsx';

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
      return (<SignIn changeScreen={this.changeScreen}
        isSignInScreen={this.state.isSignInScreen} />);
    }
    return (<SignUp isSignInScreen={this.state.isSignInScreen}
      changeScreen={this.changeScreen} />);
  }
  render() {
    return (
      <div className="index-page container">
        <div className="row">
          <div className="col s6 homeText">
            <h4>Welcome to DocGenie</h4>
            <p>Docgenie allows you to manage your documents, easily!</p>
          </div>
          <div className="col s6 pull-s1 signInOrSignUp">
            {this.renderSigninOrSignUp()}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
