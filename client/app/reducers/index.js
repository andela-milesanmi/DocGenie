import { combineReducers } from 'redux';
import documents from './document';
import user from './user';

export default combineReducers({
  documents,
  user,
  // More reducers if there are
  // can go here
});
