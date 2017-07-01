export const CREATE_USER = 'CREATE_USER';
export const VIEW_USERS = 'VIEW_USERS';
export const SIGNIN_USER = 'SIGNIN_USER';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const SIGNIN_USER_ERROR = 'SIGNIN_USER_ERROR';
export const VIEW_USERS_ERROR = 'VIEW_USERS_ERROR';
export const LOGOUT_USER = 'LOGOUT_USER';
export const CHANGE_CURRENT_PROFILE = 'CHANGE_CURRENT_PROFILE';

export default (state = {}, action) => {
  switch (action.type) {
  case CREATE_USER:
  case SIGNIN_USER:
    return { ...state, currentProfile: action.user, error: '' };
  case LOGOUT_USER:
    return { ...state, currentProfile: {}, error: '' };
  case VIEW_USERS: {
    const { currentProfile = {} } = state;
    const filteredUsers = action.users.filter(user => user.id !== currentProfile.id);
    return { ...state, users: filteredUsers, ...action.pagination };
  }
  case CREATE_USER_ERROR:
  case SIGNIN_USER_ERROR:
  case VIEW_USERS_ERROR:
    return { ...state, error: action.error };
  default:
    return state;
  }
};
