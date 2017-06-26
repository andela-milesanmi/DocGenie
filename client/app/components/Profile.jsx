import React from 'react';
import { connect } from 'react-redux';

class Profile extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { user } = this.props;
    return (
      <div className="row">
        <div className="col s8 offset-s2" style={{ backgroundColor: '#fff' }}>
          <h4>Profile Information</h4>
          <p>Fullname: {user.fullname}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {/*Change Password?
          <div className="switch">
            <label>
              Off
              <input disabled type="checkbox" />
              <span className="lever" />
              On
            </label>
          </div>*/}
          <button type="submit">Edit Profile</button>
        </div>
      </div>
    );
  }
}
// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.documents
    user: state.user
  };
};

// Maps actions to props
// const mapDispatchToProps = (dispatch) => {
//   return {
//   // You can now say this.props.createDocument
//     logoutUser: () => dispatch(logoutUser())
//   };
// };

export default connect(mapStateToProps, null)(Profile);
