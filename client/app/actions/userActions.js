import axios from 'axios';
import jwt from 'jwt-decode';
import { browserHistory } from 'react-router';
import { CREATE_USER, SIGNIN_USER, CREATE_USER_ERROR, SIGNIN_USER_ERROR,
  LOGOUT_USER, VIEW_USERS, VIEW_USERS_ERROR } from '../reducers/user';

export function createUser(user) {
  return function (dispatch) {
    return axios.post('http://localhost:5000/auth/api/users', user)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        console.log(response, 'response');
        dispatch({ type: CREATE_USER, user: response.data.user });
        browserHistory.push('/dashboard/documents');
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
        browserHistory.push('/dashboard/documents');
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

export function logoutUser() {
  // Return action
  return {
    // Unique identifier
    type: LOGOUT_USER,
    // Payload
  };
}
// export function changeCurrentUser(user) {
//   // // Return action
//   return {
//     // Unique identifier
//     type: CHANGE_CURRENT_PROFILE,
//     // Payload
//     user
//   };
// }
export function updateProfile(user) {
  const token = localStorage.getItem('token');
  const userId = jwt(token).userId;
  axios.defaults.headers.common['x-access-token'] = token;
  return function (dispatch) {
    return axios.put(`http://localhost:5000/api/users/${userId}`, user)
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
export function viewAllUsers(page = ''){ // eslint-disable-line
  const token = localStorage.getItem('token');
  const config = {
    headers: { 'x-access-token': token }
  };
  return (dispatch) => {
    axios.get(`http://localhost:5000/api/users/?page=${page}`, config)
      .then((response) => {
        dispatch({ type: VIEW_USERS, users: response.data.users, pagination: response.data.pagination });
      }).catch((error) => {
        dispatch({ type: VIEW_USERS_ERROR, error: error.response.data.message || error.response.data });
      });
  };
}
