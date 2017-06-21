import axios from 'axios';
import { CREATE_USER, EDIT_USER, SIGNIN_USER, CREATE_USER_ERROR, SIGNIN_USER_ERROR } from '../reducers/user';

export function createUser(user) {
  console.log(user, "user data from form");
  return function (dispatch) {
    axios.post('http://localhost:5000/auth/api/users', user)
      .then((response) => {
        console.log(response, 'response');
        dispatch({ type: CREATE_USER, user: response.data.user });
      }).catch((error) => {
        console.log(error.response.data.message, 'message')
        dispatch({ type: CREATE_USER_ERROR, error: error.response.data.message || error.response.data });
        console.log(error, 'error');
      });
  };
}
export function signInUser(user) {
  return function (dispatch) {
    axios.post('http://localhost:5000/auth/api/users/login', user)
      .then((response) => {
        console.log(response, 'response');
        dispatch({ type: SIGNIN_USER, user: response.data.user });
      }).catch((error) => {
        console.log(error.response.data.message, 'message');
        dispatch({ type: SIGNIN_USER_ERROR, error: error.response.data.message || error.response.data });
        console.log(error, 'error');
      });
  };
}
export function editUser(user) {
  // Return action
  console.log(CREATE_USER, 'what is edit user');
  return {
    // Unique identifier
    type: EDIT_USER,
    // Payload
    user
  };
}
