import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR, CREATE_DOCUMENT,
  CREATE_DOCUMENT_ERROR, CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT,
  VIEW_ONE_DOCUMENT, EDIT_DOCUMENT_ERROR, DELETE_DOCUMENT,
  DELETE_DOCUMENT_ERROR, VIEW_ONE_DOCUMENT_ERROR,
  SEARCH_DOCUMENT, SEARCH_DOCUMENT_ERROR } from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
  case VIEW_DOCUMENTS:
  case SEARCH_DOCUMENT: {
    const newDocuments = action.documents;
    return { ...state, documents: newDocuments, ...action.pagination, error: '' };
  }
  case VIEW_ONE_DOCUMENT: {
    return { ...state, document: action.document, error: '' };
  }
  case CHANGE_CURRENT_DOCUMENT: {
    return { ...state, currentDocument: action.document, error: '' };
  }
  case CREATE_DOCUMENT: {
    const { documents = [] } = state;
    const newDocuments = [action.document, ...documents];
    // const extractedDocuments = newDocuments.length > 6 ? [...newDocuments].slice(0, -1) : newDocuments;
    return { ...state, documents: newDocuments, error: '' };
  }
  case EDIT_DOCUMENT: {
    const { documents = [] } = state;
    const filteredDocuments =
    documents.filter(document => action.document.id !== document.id);
    return { ...state, documents: [action.document, ...filteredDocuments], error: '' };
  }
  case EDIT_DOCUMENT_ERROR:
  case DELETE_DOCUMENT_ERROR:
  case SEARCH_DOCUMENT_ERROR:
  case VIEW_DOCUMENTS_ERROR:
  case CREATE_DOCUMENT_ERROR:
  case VIEW_ONE_DOCUMENT_ERROR: {
    return { ...state, error: action.errorMessage };
  }
  case DELETE_DOCUMENT: {
    const { documents = [] } = state;
    const filteredDocuments =
    documents.filter(document => action.document.id !== document.id);
    return { ...state, documents: [...filteredDocuments], error: '' };
  }
  default:
    return state;
  }
};
