import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR, CREATE_DOCUMENT,
  CREATE_DOCUMENT_ERROR, CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT,
  EDIT_DOCUMENT_ERROR, DELETE_DOCUMENT, DELETE_DOCUMENT_ERROR,
  SEARCH_DOCUMENT, SEARCH_DOCUMENT_ERROR } from '../../app/actionTypes';

import { viewAllDocuments, changeCurrentDocument, deleteDocument,
  showOwnDocuments } from '../../app/actions/documentActions';

const mockStore = configureMockStore([thunk]);


describe('Document Action', () => {
  let store, axiosStub;
  const response = { data: {
    documents: ['i am an aboki'],
    pagination: 'what if we dont care'
  } };
  const error = {
    response: {
      data: 'an error'
    }
  };
  beforeEach(() => {
    store = mockStore({ documents: [] });
    axiosStub = sinon.stub(axios, 'get', (url) => {
      return url === 'good-url' ? Promise.resolve(response) : Promise.reject(error);
    });
  });
  afterEach(() => {
    axiosStub.restore();
  });
  it('should dispatch approirte actions on viewAllDocuments', () => {
    return store.dispatch(viewAllDocuments('good-url')).then(() => {
      expect(store.getActions()).to.deep.equal([{
        type: VIEW_DOCUMENTS,
        documents: response.data.documents,
        pagination: response.data.pagination
      }]);
    });
  });
  it('should fail and didspatch error on failed requests viewAllDocuments', () => {
    return store.dispatch(viewAllDocuments('error-url')).then(() => {
      expect(store.getActions()).to.deep.equal([{
        type: VIEW_DOCUMENTS_ERROR,
        error: error.response.data }]);
    });
  });
  // it('should dispatch VIEW_DOCUMENTS action type', () => {
  //   console.log(viewAllDocuments, 'view all documents test');
  //   expect(viewAllDocuments())
  //     .to
  //     .deep
  //     .equal({ type: VIEW_DOCUMENTS });
  // });

  xit('test documentCreateSuccessful', () => {
    expect(documentCreateSuccessful({ user: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.CREATE_DOCUMENT_SUCCESSFUL,
        response: {
          user: 1,
        },
      });
  });

  xit('test documentCreateError', () => {
    expect(documentCreateError({ error: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.CREATE_DOCUMENT_SUCCESSFUL,
        error: {
          error: 1,
        },
      });
  });
});

xdescribe('User Action Unit Test:', () => {
  it('test fetchDocumentRequest', () => {
    expect(fetchDocumentRequest())
      .to
      .deep
      .equal({ type: ActionTypes.FETCH_DOCUMENT_REQUEST });
  });

  it('test fetchDocumentSuccessful', () => {
    expect(fetchDocumentSuccessful({ user: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.FETCH_DOCUMENT_SUCCESSFUL,
        response: {
          user: 1,
        },
      });
  });

  it('test fetchDocumentError', () => {
    expect(fetchDocumentError({ error: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.FETCH_DOCUMENT_FAIL,
        error: {
          error: 1,
        },
      });
  });
});

xdescribe('User Action Unit Test:', () => {
  it('test updateDocumentRequest', () => {
    expect(updateDocumentRequest())
      .to
      .deep
      .equal({ type: ActionTypes.UPDATE_DOCUMENT_REQUEST });
  });

  it('test updateDocumentSuccessful', () => {
    expect(updateDocumentSuccessful({ user: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.UPDATE_DOCUMENT_SUCCESSFUL,
        response: {
          user: 1,
        },
      });
  });

  it('test updateDocumentError', () => {
    expect(updateDocumentError({ error: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.UPDATE_DOCUMENT_FAIL,
        error: {
          error: 1,
        },
      });
  });
});

xdescribe('User Action Unit Test:', () => {
  it('test deleteDocumentRequest', () => {
    expect(deleteDocumentRequest())
      .to
      .deep
      .equal({ type: ActionTypes.DELETE_DOCUMENT_REQUEST });
  });

  it('test deleteDocumentSuccessful', () => {
    expect(deleteDocumentSuccessful({ user: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.DELETE_DOCUMENT_SUCCESSFUL,
        response: {
          user: 1,
        },
      });
  });

  it('test deleteDocumentError', () => {
    expect(deleteDocumentError({ error: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.DELETE_DOCUMENT_FAIL,
        error: {
          error: 1,
        },
      });
  });
});

xdescribe('User Action Unit Test:', () => {
  it('test searchDocumentRequest', () => {
    expect(searchDocumentRequest())
      .to
      .deep
      .equal({ type: ActionTypes.SEARCH_DOCUMENT_REQUEST });
  });

  it('test searchDocumentSuccessful', () => {
    expect(searchDocumentSuccessful({ user: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.SEARCH_DOCUMENT_SUCCESSFUL,
        response: {
          user: 1,
        },
      });
  });

  it('test searchDocumentError', () => {
    expect(searchDocumentError({ error: 1 }))
      .to
      .deep
      .equal({
        type: ActionTypes.SEARCH_DOCUMENT_FAIL,
        error: {
          error: 1,
        },
      });
  });
});
