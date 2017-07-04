import axios from 'axios';
import jwt from 'jwt-decode';
import toastr from 'toastr';
import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR, CREATE_DOCUMENT,
  CREATE_DOCUMENT_ERROR, CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT,
  EDIT_DOCUMENT_ERROR, DELETE_DOCUMENT, DELETE_DOCUMENT_ERROR,
  SEARCH_DOCUMENT, SEARCH_DOCUMENT_ERROR } from '../actionTypes';

export const viewAllDocuments = (url) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    return axios.get(url, config)
      .then((response) => {
        console.log(response, 'response.data in viewAllDocuments action');
        dispatch({ type: VIEW_DOCUMENTS,
          documents: response.data.documents,
          pagination: response.data.pagination });
      }).catch((error) => {
        dispatch({ type: VIEW_DOCUMENTS_ERROR,
          error: error.response.data.message || error.response.data });
      });
  };
};
export const createDocument = (document) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    axios.post('/api/documents', document, config)
      .then((response) => {
        toastr.success('Document Created successfully');
        dispatch({ type: CREATE_DOCUMENT,
          document: { ...document, ...response.data } });
      }).catch((error) => {
        const errorMessage = error.response.data.message || error.response.data;
        toastr.error(errorMessage);
        dispatch({ type: CREATE_DOCUMENT_ERROR,
          errorMessage });
      });
  };
};
export const changeCurrentDocument = (document) => {
  // Return action
  return {
    // Unique identifier
    type: CHANGE_CURRENT_DOCUMENT,
    // Payload
    document
  };
};
export const editDocument = (document) => {
  const token = localStorage.getItem('token');
  document.userId = jwt(token).userId;
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    axios.put(`/api/documents/${document.id}`,
      document, config)
      .then((response) => {
        dispatch({ type: EDIT_DOCUMENT, document: response.data });
      }).catch((error) => {
        dispatch({ type: EDIT_DOCUMENT_ERROR,
          error: error.response.data.message || error.response.data });
      });
  };
};
export const deleteDocument = (document) => {
  const token = localStorage.getItem('token');
  document.userId = jwt(token).userId;
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    axios.delete(`/api/documents/${document.id}`,
      document, config)
      .then((response) => {
        dispatch({ type: DELETE_DOCUMENT, document });
      }).catch((error) => {
        dispatch({ type: DELETE_DOCUMENT_ERROR,
          error: error.response.data.message || error.response.data });
      });
  };
};

export const searchForDocuments = (searchKey) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    axios.get(`/api/search/documents/${searchKey}`, config)
      .then((response) => {
        console.log(response, 'response in SEARCH_DOCUMENT');
        dispatch({ type: SEARCH_DOCUMENT, documents: response.data || [] });
      }).catch((error) => {
        console.log(error, 'what error are we having IN CREATE_DOCUMENT?');
        dispatch({ type: SEARCH_DOCUMENT_ERROR,
          error: error.response.data.message || error.response.data });
      });
  };
};
