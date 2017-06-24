export const CREATE_USER = 'CREATE_USER';
// export const GET_USER = 'GET_USER';
export const EDIT_USER = 'EDIT_USER';
export const SIGNIN_USER = 'SIGNIN_USER';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const SIGNIN_USER_ERROR = 'SIGNIN_USER_ERROR';
export const LOGOUT_USER = 'LOGOUT_USER';
// export const GET_USER_ERROR = 'GET_USER_ERROR';

export default (state = {}, action) => {
  switch (action.type) {
  case CREATE_USER:
    return { ...state, ...action.user, error: '' };
  case EDIT_USER:
    return Object.assign({}, state, action.user, { error: '' });
  case LOGOUT_USER:
    // console.log({ ...state, user: {}, error: '' })
    return ({});
  case SIGNIN_USER:
    return Object.assign({}, state, action.user, { error: '' });
  // case GET_USER:
  //   return { ...state, ...action.user, error: '' };
  case CREATE_USER_ERROR:
    console.log(action, 'actions create_user_error');
    return Object.assign({}, state, { error: action.error });
  case SIGNIN_USER_ERROR:
    console.log(action, 'actions signin_user_error');
    return Object.assign({}, state, { error: action.error });
  // case GET_USER_ERROR:
  //   console.log(action, 'actions get_user_error');
  //   return Object.assign({}, state, { error: action.error });
  default:
    return state;
  }
};
