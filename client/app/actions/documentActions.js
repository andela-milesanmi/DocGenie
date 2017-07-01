import axios from 'axios';
import jwt from 'jwt-decode';
import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR, CREATE_DOCUMENT, CREATE_DOCUMENT_ERROR,
  CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT, EDIT_DOCUMENT_ERROR, DELETE_DOCUMENT,
  DELETE_DOCUMENT_ERROR, SEARCH_DOCUMENT, SEARCH_DOCUMENT_ERROR } from '../reducers/document';

export function viewAllDocuments(url){ // eslint-disable-line
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    axios.get(url, config)
      .then((response) => {
        console.log(response.data, "response.data in viewAllDocuments action");
        dispatch({ type: VIEW_DOCUMENTS, documents: response.data.documents, pagination: response.data.pagination });
      }).catch((error) => {
        dispatch({ type: VIEW_DOCUMENTS_ERROR, error: error.response.data.message || error.response.data });
      });
  };
}
export function createDocument(document) { // eslint-disable-line
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  // axios.defaults.headers.common['x-access-token'] = token;
  return (dispatch) => {
    axios.post('http://localhost:5000/api/documents', document, config)
      .then((response) => {
        dispatch({ type: CREATE_DOCUMENT, document: { ...document, ...response.data } });
      }).catch((error) => {
        console.log(error, 'this is an error');
        dispatch({ type: CREATE_DOCUMENT_ERROR, error: error.response.data.message || error.response.data });
      });
  };
}
export function changeCurrentDocument(document) {
  // Return action
  return {
    // Unique identifier
    type: CHANGE_CURRENT_DOCUMENT,
    // Payload
    document
  };
}
export function editDocument(document) { // eslint-disable-line
  const token = localStorage.getItem('token');
  document.userId = jwt(token).userId;
  // axios.defaults.headers.common['x-access-token'] = token;
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    axios.put(`http://localhost:5000/api/documents/${document.id}`, document, config)
      .then((response) => {
        dispatch({ type: EDIT_DOCUMENT, document: response.data });
      }).catch((error) => {
        dispatch({ type: EDIT_DOCUMENT_ERROR, error: error.response.data.message || error.response.data });
      });
  };
}
export function deleteDocument(document) { // eslint-disable-line
  const token = localStorage.getItem('token');
  document.userId = jwt(token).userId;
  // axios.defaults.headers.common['x-access-token'] = token;
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    axios.delete(`http://localhost:5000/api/documents/${document.id}`, document, config)
      .then((response) => {
        dispatch({ type: DELETE_DOCUMENT, document });
      }).catch((error) => {
        dispatch({ type: DELETE_DOCUMENT_ERROR, error: error.response.data.message || error.response.data });
      });
  };
}

export function searchForDocuments(searchKey) { // eslint-disable-line
  const token = localStorage.getItem('token');
  // axios.defaults.headers.common['x-access-token'] = token;
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    axios.get(`http://localhost:5000/api/search/documents/${searchKey}`, config)
      .then((response) => {
        console.log(response, 'response in CREATE_DOCUMENT');
        dispatch({ type: SEARCH_DOCUMENT, documents: response.data || [] });
      }).catch((error) => {
        console.log(error, 'what error are we having IN CREATE_DOCUMENT?');
        dispatch({ type: SEARCH_DOCUMENT_ERROR, error: error.response.data.message || error.response.data });
      });
  };
}
