import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR, CREATE_DOCUMENT,
  CHANGE_CURRENT_DOCUMENT, DELETE_DOCUMENT,
  SEARCH_DOCUMENT } from '../../app/actionTypes';

import { viewAllDocuments, changeCurrentDocument, deleteDocument, createDocument,
  searchForDocuments } from '../../app/actions/documentActions';

const mockStore = configureMockStore([thunk]);


describe('Document Action', () => {
  let store, axiosGetStub, axiosPostStub, axiosPutStub, axiosDeleteStub;
  const response = { data: {
    documents: ['I am one document'],
    pagination: 'pagination object'
  } };
  const error = {
    response: {
      data: 'an error'
    }
  };
  beforeEach(() => {
    store = mockStore({ documents: [] });
    axiosGetStub = sinon.stub(axios, 'get', (url) => {
      return url.indexOf('good-url') > -1 ? Promise.resolve(response) : Promise.reject(error);
    });
    axiosPostStub = sinon.stub(axios, 'post', (url) => {
      return url.indexOf('api') > -1 ? Promise.resolve(response) : Promise.reject(error);
    });
    axiosPutStub = sinon.stub(axios, 'put', (url) => {
      return url.indexOf('api') > -1 ? Promise.resolve(response) : Promise.reject(error);
    });
    axiosDeleteStub = sinon.stub(axios, 'delete', (url) => {
      return url.indexOf('api') > -1 ? Promise.resolve(response) : Promise.reject(error);
    });
  });
  afterEach(() => {
    axiosGetStub.restore();
    axiosPostStub.restore();
    axiosPutStub.restore();
    axiosDeleteStub.restore();
  });
  it('should dispatch appropriate actions on viewAllDocuments', () => {
    return store.dispatch(viewAllDocuments('good-url')).then(() => {
      expect(store.getActions()).to.deep.equal([{
        type: VIEW_DOCUMENTS,
        documents: response.data.documents,
        pagination: response.data.pagination
      }]);
    });
  });
  it('should fail and dispatch error on failed request viewAllDocuments request', () => {
    return store.dispatch(viewAllDocuments('error-url')).then(() => {
      expect(store.getActions()).to.deep.equal([{
        type: VIEW_DOCUMENTS_ERROR,
        error: error.response.data }]);
    });
  });
  it('should dispatch appropriate actions on createDocument', () => {
    const document = { id: 23, userId: 45, title: 'A good life', content: 'A good life by Marion Bennet' };
    return store.dispatch(createDocument(document)).then(() => {
      expect(store.getActions()).to.deep.equal([{ type: CREATE_DOCUMENT,
        document: { ...document, ...response.data } }]);
    });
  });
  it('should dispatch appropriate actions on changeCurrentDocument', () => {
    const document = { id: 23, userId: 45, title: 'A good life', content: 'A good life by Marion Bennet' };
    expect(changeCurrentDocument(document)).to.deep.equal({
      type: CHANGE_CURRENT_DOCUMENT,
      document
    });
  });
  it('should dispatch appropriate actions on editDocument', () => {
    const document = { id: 23, userId: 45, title: 'A good life', content: 'A good life by Marion Bennet' };
    return store.dispatch(createDocument(document)).then(() => {
      expect(store.getActions()).to.deep.equal([{ type: CREATE_DOCUMENT,
        document: { ...document, ...response.data } }]);
    });
  });
  it('should dispatch appropriate actions on deleteDocument', () => {
    const document = { id: 23, userId: 45, title: 'A good life', content: 'A good life by Marion Bennet' };
    return store.dispatch(deleteDocument(document)).then(() => {
      expect(store.getActions()).to.deep.equal([{ type: DELETE_DOCUMENT, document }]);
    });
  });
  it('should dispatch appropriate actions on searchForDocuments', () => {
    const searchKey = 'the';
    return store.dispatch(searchForDocuments(`good-url/${searchKey}`)).then(() => {
      expect(store.getActions()).to.deep.equal([{ type: SEARCH_DOCUMENT, documents: response.data || [] }]);
    });
  });
});
