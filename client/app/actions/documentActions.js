import axios from 'axios';
import toastr from 'toastr';
import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR, CREATE_DOCUMENT,
  CREATE_DOCUMENT_ERROR, CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT,
  EDIT_DOCUMENT_ERROR, DELETE_DOCUMENT, DELETE_DOCUMENT_ERROR,
  SEARCH_DOCUMENT, SEARCH_DOCUMENT_ERROR, VIEW_ONE_DOCUMENT,
  VIEW_ONE_DOCUMENT_ERROR } from '../actionTypes';

let errorMessage;

export const viewAllDocuments = (paginationMetadata) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  const { limit, offset } = paginationMetadata;
  return (dispatch) => {
    return axios.get(`/api/documents/?limit=${limit}&offset=${offset}`, config)
      .then((response) => {
        dispatch({ type: VIEW_DOCUMENTS,
          documents: response.data.documents,
          pagination: response.data.pagination });
      }, () => {}).catch((error) => {
        errorMessage = error.response.data.message || error.response.data || '';
        dispatch({ type: VIEW_DOCUMENTS_ERROR,
          errorMessage });
        return Promise.reject(errorMessage);
      });
  };
};

export const viewOwnDocuments = (paginationMetadata) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  const { limit, offset, userId } = paginationMetadata;
  const url = `/api/users/${userId}/documents/?limit=${limit}&offset=${offset}`;
  return (dispatch) => {
    return axios.get(url, config)
      .then((response) => {
        dispatch({ type: VIEW_DOCUMENTS,
          documents: response.data.documents,
          pagination: response.data.pagination });
      }, () => {}).catch((error) => {
        errorMessage = error.response.data.message || error.response.data || '';
        dispatch({ type: VIEW_DOCUMENTS_ERROR,
          errorMessage });
        return Promise.reject(errorMessage);
      });
  };
};

export const createDocument = (document, paginationMetadata) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    return axios.post('/api/documents', document, config)
      .then((response) => {
        toastr.success('Document created!');
        dispatch({ type: CREATE_DOCUMENT,
          document: { ...document, ...response.data } });
        dispatch(viewAllDocuments(paginationMetadata));
        $('#create-form').modal('close');
      }).catch((error) => {
        errorMessage = error.response.data.message || error.response.data;

        dispatch({ type: CREATE_DOCUMENT_ERROR,
          errorMessage });
        return Promise.reject(toastr.error(errorMessage));
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
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    return axios.put(`/api/documents/${document.id}`,
      document, config)
      .then((response) => {
        toastr.success('Document edited!');
        dispatch({ type: EDIT_DOCUMENT,
          document: { ...document, ...response.data } });
        $('#create-form').modal('close');
      }).catch((error) => {
        errorMessage = error.response.data.message || error.response.data;
        dispatch({ type: EDIT_DOCUMENT_ERROR,
          errorMessage });
        return Promise.reject(toastr.error(errorMessage));
      });
  };
};
export const deleteDocument = (document, paginationMetadata) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    return axios.delete(`/api/documents/${document.id}`, config)
      .then((response) => {
        dispatch({ type: DELETE_DOCUMENT, document });
        dispatch(viewAllDocuments(paginationMetadata));
      }).catch((error) => {
        dispatch({ type: DELETE_DOCUMENT_ERROR,
          errorMessage: error.response.data.message || error.response.data });
      });
  };
};

export const searchForDocuments = (searchData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  const { searchKey, limit, offset } = searchData;
  const url =
  `/api/search/documents/?searchKey=${searchKey}&limit=${limit}&offset=${offset}`;
  return (dispatch) => {
    return axios.get(url, config)
      .then((response) => {
        dispatch({ type: SEARCH_DOCUMENT,
          documents: response.data.documents || [],
          pagination: response.data.pagination });
      }).catch((error) => {
        dispatch({ type: SEARCH_DOCUMENT_ERROR,
          errorMessage: error.response.data.message || error.response.data });
      });
  };
};

export const findADocument = (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { authorization: token }
  };
  return (dispatch) => {
    return axios.get(`/api/documents/${id}`, config)
      .then((response) => {
        dispatch({ type: VIEW_ONE_DOCUMENT, document: { ...response.data } });
      }).catch((error) => {
        dispatch({ type: VIEW_ONE_DOCUMENT_ERROR,
          errorMessage: error.response.data.message || error.response.data });
      });
  };
};
