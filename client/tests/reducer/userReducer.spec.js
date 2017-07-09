import { expect } from 'chai';
import { CREATE_USER, SIGNIN_USER, CREATE_USER_ERROR, SIGNIN_USER_ERROR,
  LOGOUT_USER, VIEW_USERS, VIEW_USERS_ERROR } from '../../app/actionTypes';
import reducer from '../../app/reducers/user';
import fakeData from '../../../server/tests/fakeData/fakeData';

describe('User reducer', () => {
  it('should handle CREATE_USER', () => {
    expect(
      reducer({}, {
        type: CREATE_USER,
        user: fakeData.testUser
      })
    ).to.eql(
      {
        currentProfile: fakeData.testUser,
        error: ''
      }
    );
  });
  it('should handle SIGNIN_USER', () => {
    expect(
      reducer({}, {
        type: SIGNIN_USER,
        user: fakeData.testUser
      })
    ).to.eql({
      currentProfile: fakeData.testUser,
      error: ''
    });
  });
  it('should handle CREATE_USER_ERROR', () => {
    expect(
      reducer({}, {
        type: CREATE_USER_ERROR,
        errorMessage: 'error while creating new document'
      })
    ).to.eql({
      error: 'error while creating new document'
    });
  });

  it('should handle LOGOUT_USER', () => {
    expect(
      reducer({}, {
        type: LOGOUT_USER,
        user: fakeData.testUser
      })
    ).to.eql({
      currentProfile: {},
      error: ''
    });
  });
  it('should handle VIEW_USERS', () => {
    expect(
      reducer({}, {
        type: VIEW_USERS,
        users: [fakeData.testUser]
      })
    ).to.eql({
      users: [fakeData.testUser],
      error: ''
    });
  });
});
