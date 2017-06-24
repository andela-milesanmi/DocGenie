import axios from 'axios';
import jwt from 'jwt-decode';
import { browserHistory } from 'react-router';
import { CREATE_USER, EDIT_USER, SIGNIN_USER, CREATE_USER_ERROR, SIGNIN_USER_ERROR,
LOGOUT_USER } from '../reducers/user';

export function createUser(user) {
  return function (dispatch) {
    return axios.post('http://localhost:5000/auth/api/users', user)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        console.log(response, 'response');
        dispatch({ type: CREATE_USER, user: response.data.user });
        browserHistory.push('/dashboard');
      }).catch((error) => {
        console.log(error.response.data.message, 'message');
        dispatch({ type: CREATE_USER_ERROR, error: error.response.data.message || error.response.data });
        return Promise.reject(error);
      });
  };
}
export function signInUser(user) {
  return function (dispatch) {
    return axios.post('http://localhost:5000/auth/api/users/login', user)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        console.log(response, 'response');
        dispatch({ type: SIGNIN_USER, user: response.data.user });
        browserHistory.push('/dashboard');
      }).catch((error) => {
        console.log(error, 'message');
        dispatch({ type: SIGNIN_USER_ERROR, error: error.response.data.message || error.response.data });
        console.log(error, 'error');
      });
  };
}
export function getUser() {
  const token = localStorage.getItem('token');
  const userId = jwt(token).userId;
  axios.defaults.headers.common['x-access-token'] = token;
  return function (dispatch) {
    return axios.get(`http://localhost:5000/api/users/${userId}`)
      .then((response) => {
        console.log(response, 'response');
        dispatch({ type: CREATE_USER, user: response.data });
      }).catch((error) => {
        console.log(error, 'message');
        dispatch({ type: CREATE_USER_ERROR, error: error.response.data.message || error.response.data });
        console.log(error, 'error');
      });
  };
}
export function editUser(user) {
  // Return action
  return {
    // Unique identifier
    type: EDIT_USER,
    // Payload
    user
  };
}
export function logoutUser() {
  // Return action
  return {
    // Unique identifier
    type: LOGOUT_USER,
    // Payload
  };
}
