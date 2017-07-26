import axios from 'axios';
import jwt from 'jwt-decode';
import { browserHistory } from 'react-router';
import toastr from 'toastr';
import { CREATE_USER, SIGNIN_USER, LOGOUT_USER, VIEW_USERS, SEARCH_USERS,
  SEARCH_USERS_ERROR, VIEW_USERS_ERROR, CREATE_USER_ERROR, SIGNIN_USER_ERROR,
  UPDATE_USER, UPDATE_USER_ERROR } from '../actionTypes';

let errorMessage;

/**
* @description - User signup action:
* It creates the new user account and sets token in localStorage
* @param {object} user - user details
* @returns {function} dispatch - redux dispatch function
*/
export const createUser = (user) => {
  return (dispatch) => {
    return axios.post('/auth/api/users', user)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        dispatch({ type: CREATE_USER, user: response.data.user });
        browserHistory.push('/dashboard');
      }, (error) => {
        dispatch({ type: CREATE_USER_ERROR,
          errorMessage: error.response.data.message });
      }).catch((error) => {
        errorMessage = error.response.data.message || error.response.data;
        dispatch({ type: CREATE_USER_ERROR, errorMessage });
        return Promise.reject(error);
      });
  };
};

/**
 * @description - User Login action:
 * It logs in the user and sets user token in localStorage
 * @param {object} user - user Details
 * @returns {function} dispatch - redux dispatch function
 */
export const signInUser = (user) => {
  return (dispatch) => {
    return axios.post('/auth/api/users/login', user)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        dispatch({ type: SIGNIN_USER, user: response.data.user });
        browserHistory.push('/dashboard');
      }, (error) => {
        dispatch({ type: SIGNIN_USER_ERROR,
          errorMessage: error.response.data.message });
      }).catch((error) => {
        errorMessage = error.response.data.message || error.response.data;
        dispatch({ type: SIGNIN_USER_ERROR, errorMessage });
        return Promise.reject(error);
      });
  };
};

/**
* @description - fetches user details and populates the store.
* @returns {function} dispatch - redux dispatch function
*/
export const getUser = () => {
  const token = localStorage.getItem('token');
  const userId = jwt(token).userId;
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    return axios.get(`/api/users/${userId}`, config)
      .then((response) => {
        dispatch({ type: CREATE_USER, user: response.data });
      }).catch((error) => {
        errorMessage = error.response.data.message || error.response.data;
        dispatch({ type: CREATE_USER_ERROR, errorMessage });
        throw new Error('UserInvalidToken');
      });
  };
};

/**
* @description - User signup action:
* It creates the new user account and sets token in localStorage
* @returns {object} action - redux action object
*/
export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};

/**
* @description - allows admin or a user update their profile
* @param {object} user - fullname, username, email, password
* @param {number} id - userId
* @returns {function} dispatch - redux dispatch function
*/
export const updateProfile = (user, id) => {
  const token = localStorage.getItem('token');
  const userId = id || jwt(token).userId;
  const config = {
    headers: { authorization: token }
  };

  return (dispatch) => {
    return axios.put(`/api/users/${userId}`, user, config)
      .then((response) => {
        dispatch({ type: UPDATE_USER, user: response.data });
        toastr.success('Profile updated successfully!');
      }).catch((error) => {
        errorMessage = error.response.data.message || error.response.data;
        dispatch({ type: UPDATE_USER_ERROR, errorMessage });
        return Promise.reject(toastr.error(errorMessage));
      });
  };
};

/**
* @description - allows admin view all users
* @param {object} paginationMetadata - limit, offset
* @returns {function} dispatch - redux dispatch function
*/
export const viewAllUsers = (paginationMetadata) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  const { limit, offset } = paginationMetadata;

  return (dispatch) => {
    return axios.get(`/api/users/?limit=${limit}&offset=${offset}`, config)
      .then((response) => {
        dispatch({ type: VIEW_USERS,
          users: response.data.users,
          pagination: response.data.pagination });
      }).catch((error) => {
        errorMessage = error.response.data.message || error.response.data;
        dispatch({ type: VIEW_USERS_ERROR, errorMessage });
      });
  };
};

/**
* @description - allows admin search for a particular user
* @param {object} searchData - searchKey, limit, offset
* @returns {function} dispatch - redux dispatch function
*/
export const searchForUsers = (searchData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  const { searchKey, limit, offset } = searchData;
  const url =
   `/api/search/users/?searchKey=${searchKey}&limit=${limit}&offset=${offset}`;
  return (dispatch) => {
    return axios.get(url, config)
      .then((response) => {
        dispatch({ type: SEARCH_USERS,
          users: response.data.users || [],
          pagination: response.data.pagination });
      }).catch((error) => {
        errorMessage = error.response.data.message || error.response.data;
        dispatch({ type: SEARCH_USERS_ERROR, errorMessage });
      });
  };
};
