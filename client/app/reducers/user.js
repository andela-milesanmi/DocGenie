export const CREATE_USER = 'CREATE_USER';
// export const GET_USER = 'GET_USER';
export const EDIT_USER = 'EDIT_USER';
export const SIGNIN_USER = 'SIGNIN_USER';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const SIGNIN_USER_ERROR = 'SIGNIN_USER_ERROR';
export const LOGOUT_USER = 'LOGOUT_USER';
export const CHANGE_CURRENT_PROFILE = 'CHANGE_CURRENT_PROFILE';

export default (state = {}, action) => {
  switch (action.type) {
  case CREATE_USER:
  case SIGNIN_USER:
  case EDIT_USER:
  case CHANGE_CURRENT_PROFILE:
    return { ...state, currentProfile: action.user, error: '' };
  case LOGOUT_USER:
    return { ...state, currentProfile: {}, error: '' };
  case CREATE_USER_ERROR:
  case SIGNIN_USER_ERROR:
    return Object.assign({}, state, { error: action.error });
  default:
    return state;
  }
};
