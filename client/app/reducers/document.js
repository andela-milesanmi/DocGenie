export const CREATE_DOCUMENT = 'CREATE_DOCUMENT';
export const VIEW_DOCUMENTS = 'VIEW_DOCUMENTS';
export const EDIT_DOCUMENT = 'EDIT_DOCUMENT';
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT';

export const CREATE_DOCUMENT_ERROR = 'CREATE_DOCUMENT_ERROR';
export const VIEW_DOCUMENTS_ERROR = 'VIEW_DOCUMENTS_ERROR';
export const EDIT_DOCUMENT_ERROR = 'EDIT_DOCUMENT_ERROR';
export const DELETE_DOCUMENT_ERROR = 'DELETE_DOCUMENT_ERROR';


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
  case VIEW_DOCUMENTS_ERROR :
    return { ...state, error: action.error };
  default:
    return state;
  }
};
