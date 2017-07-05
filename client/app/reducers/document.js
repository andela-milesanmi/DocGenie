import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR, CREATE_DOCUMENT,
  CREATE_DOCUMENT_ERROR, CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT,
  EDIT_DOCUMENT_ERROR, DELETE_DOCUMENT, DELETE_DOCUMENT_ERROR,
  SEARCH_DOCUMENT, SEARCH_DOCUMENT_ERROR } from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
  case VIEW_DOCUMENTS: {
    const newDocuments = action.documents;
    console.log(newDocuments, 'newDocuments in view_documents in reducer');
    return { ...state, documents: newDocuments, ...action.pagination };
  }
  case SEARCH_DOCUMENT: {
    return { ...state, documents: action.documents };
  }
  case VIEW_DOCUMENTS_ERROR : {
    return { ...state, error: action.error };
  }
  case CHANGE_CURRENT_DOCUMENT: {
    return { ...state, currentDocument: action.document };
  }
  case CREATE_DOCUMENT: {
    const { documents = [] } = state;
    const newDocuments = [action.document, ...documents];
    return { ...state, documents: newDocuments };
  }
  case EDIT_DOCUMENT: {
    const { documents = [] } = state;
    const filteredDocuments =
    documents.filter(document => action.document.id !== document.id);
    return { ...state, documents: [action.document, ...filteredDocuments] };
  }
  case EDIT_DOCUMENT_ERROR:
  case DELETE_DOCUMENT_ERROR:
  case SEARCH_DOCUMENT_ERROR:
  case CREATE_DOCUMENT_ERROR: {
    return { ...state, error: action.error };
  }
  case DELETE_DOCUMENT: {
    const { documents = [] } = state;
    const filteredDocuments =
    documents.filter(document => action.document.id !== document.id);
    return { ...state, documents: [...filteredDocuments] };
  }
  default:
    return state;
  }
};
