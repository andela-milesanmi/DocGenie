import axios from 'axios';
import jwt from 'jwt-decode';
import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR, CREATE_DOCUMENT, CREATE_DOCUMENT_ERROR,
  CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT, EDIT_DOCUMENT_ERROR, DELETE_DOCUMENT,
  DELETE_DOCUMENT_ERROR, SEARCH_DOCUMENT, SEARCH_DOCUMENT_ERROR } from '../reducers/document';

export function viewAllDocuments(page = ''){ // eslint-disable-line
  const token = localStorage.getItem('token');
  const config = {
    headers: { 'x-access-token': token }
  };
  return (dispatch) => {
    axios.get(`http://localhost:5000/api/documents/?page=${page}`, config)
      .then((response) => {
        console.log(response, 'response');
        dispatch({ type: VIEW_DOCUMENTS, documents: response.data.documents, pagination: response.data.pagination });
      }).catch((error) => {
        console.log(error, 'what error are we having?');
        dispatch({ type: VIEW_DOCUMENTS_ERROR, error: error.response.data.message || error.response.data });
        console.log(error, 'error');
      });
  };
}
export function createDocument(document) { // eslint-disable-line
  // console.log(document, 'create document in actions');
  const token = localStorage.getItem('token');
  document.userId = jwt(token).userId;
  axios.defaults.headers.common['x-access-token'] = token;
  return (dispatch) => {
    axios.post('http://localhost:5000/api/documents', document)
      .then((response) => {
        // console.log(response, 'response in CREATE_DOCUMENT');
        dispatch({ type: CREATE_DOCUMENT, document: response.data });
      }).catch((error) => {
        // console.log(error, 'what error are we having IN CREATE_DOCUMENT?');
        dispatch({ type: CREATE_DOCUMENT_ERROR, error: error.response.data.message || error.response.data });
        // console.log(error, 'error');
      });
  };
}
export function changeCurrentDocument(document) {
  // // Return action
  return {
    // Unique identifier
    type: CHANGE_CURRENT_DOCUMENT,
    // Payload
    document
  };
}
export function editDocument(document) { // eslint-disable-line
  // console.log(document, 'create document in actions');
  const token = localStorage.getItem('token');
  document.userId = jwt(token).userId;
  axios.defaults.headers.common['x-access-token'] = token;
  return (dispatch) => {
    axios.put(`http://localhost:5000/api/documents/${document.id}`, document)
      .then((response) => {
        // console.log(response, 'response in CREATE_DOCUMENT');
        dispatch({ type: EDIT_DOCUMENT, document: response.data });
      }).catch((error) => {
        // console.log(error, 'what error are we having IN CREATE_DOCUMENT?');
        dispatch({ type: EDIT_DOCUMENT_ERROR, error: error.response.data.message || error.response.data });
        // console.log(error, 'error');
      });
  };
}
export function deleteDocument(document) { // eslint-disable-line
  // console.log(document, 'create document in actions');
  const token = localStorage.getItem('token');
  document.userId = jwt(token).userId;
  axios.defaults.headers.common['x-access-token'] = token;
  return (dispatch) => {
    axios.delete(`http://localhost:5000/api/documents/${document.id}`, document)
      .then((response) => {
        // console.log(response, 'response in CREATE_DOCUMENT');
        dispatch({ type: DELETE_DOCUMENT, document });
      }).catch((error) => {
        // console.log(error, 'what error are we having IN CREATE_DOCUMENT?');
        dispatch({ type: DELETE_DOCUMENT_ERROR, error: error.response.data.message || error.response.data });
        // console.log(error, 'error');
      });
  };
}

export function searchForDocuments(searchKey) { // eslint-disable-line
  // console.log(document, 'create document in actions');
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['x-access-token'] = token;
  return (dispatch) => {
    axios.get(`http://localhost:5000/api/search/documents/${searchKey}`)
      .then((response) => {
        console.log(response, 'response in CREATE_DOCUMENT');
        dispatch({ type: SEARCH_DOCUMENT, documents: response.data || [] });
      }).catch((error) => {
        console.log(error, 'what error are we having IN CREATE_DOCUMENT?');
        dispatch({ type: SEARCH_DOCUMENT_ERROR, error: error.response.data.message || error.response.data });
      });
  };
}
