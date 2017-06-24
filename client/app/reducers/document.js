export const CREATE_DOCUMENT = 'CREATE_DOCUMENT';
export const VIEW_DOCUMENTS = 'VIEW_DOCUMENTS';
export const EDIT_DOCUMENT = 'EDIT_DOCUMENT';
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT';

export const CREATE_DOCUMENT_ERROR = 'CREATE_DOCUMENT_ERROR';
export const VIEW_DOCUMENTS_ERROR = 'VIEW_DOCUMENTS_ERROR';
export const EDIT_DOCUMENT_ERROR = 'EDIT_DOCUMENT_ERROR';
export const DELETE_DOCUMENT_ERROR = 'DELETE_DOCUMENT_ERROR';
export const CHANGE_CURRENT_DOCUMENT = 'CHANGE_CURRENT_DOCUMENT';
export const SEARCH_DOCUMENT = 'SEARCH_DOCUMENT';
export const SEARCH_DOCUMENT_ERROR = 'SEARCH_DOCUMENT_ERROR';

export default (state = {}, action) => {
  switch (action.type) {
  case VIEW_DOCUMENTS: {
    const { documents = [] } = state;
    const newDocuments = [...documents, ...action.documents];
    return { ...state, documents: newDocuments };
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
    const filteredDocuments = documents.filter(document => action.document.id !== document.id);
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
    const filteredDocuments = documents.filter(document => action.document.id !== document.id);
    return { ...state, documents: [...filteredDocuments] };
  }
  default:
    return state;
  }
};
