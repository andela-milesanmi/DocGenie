export const CREATE_DOCUMENT = 'CREATE_DOCUMENT';
export const VIEW_DOCUMENTS = 'VIEW_DOCUMENTS';
export const EDIT_DOCUMENT = 'EDIT_DOCUMENT';
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT';

export const CREATE_DOCUMENT_ERROR = 'CREATE_DOCUMENT_ERROR';
export const VIEW_DOCUMENTS_ERROR = 'VIEW_DOCUMENTS_ERROR';
export const EDIT_DOCUMENT_ERROR = 'EDIT_DOCUMENT_ERROR';
export const DELETE_DOCUMENT_ERROR = 'DELETE_DOCUMENT_ERROR';
export const CHANGE_CURRENT_DOCUMENT = 'CHANGE_CURRENT_DOCUMENT';


// export default (state = [], action) => {
//   switch (action.type) {
//   case CREATE_DOCUMENT:
//     return [
//       ...state,
//       Object.assign({}, action.document)
//     ];
//   default:
//     return state;
//   }
// };
// documents
// error
export default (state = {}, action) => {
  switch (action.type) {
  case VIEW_DOCUMENTS: {
    const { documents = [] } = state;
    const newDocuments = [...documents, ...action.documents];
    return { ...state, documents: newDocuments };
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
  case CREATE_DOCUMENT_ERROR: {
    return { ...state, error: action.error };
  }
  case EDIT_DOCUMENT: {
    const { documents = [] } = state;
    const filteredDocuments = documents.filter(doc => action.document.id !== doc.id);
    return { ...state, documents: [action.document, ...filteredDocuments] };
  }
  case EDIT_DOCUMENT_ERROR: {
    return { ...state, error: action.error };
  }
  default:
    return state;
  }
};
