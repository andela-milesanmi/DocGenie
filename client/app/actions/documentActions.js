import axios from 'axios';
import jwt from 'jwt-decode';
import { VIEW_DOCUMENTS, VIEW_DOCUMENTS_ERROR } from '../reducers/document';

const token = localStorage.getItem('token');
const decoded = jwt(token);
const userId = decoded.userId;
const config = {
  headers: { 'x-access-token': token }
};

export function viewAllDocuments(){ // eslint-disable-line
  return (dispatch) => {
    axios.get('http://localhost:5000/api/documents', config)
      .then((response) => {
        console.log(response, 'response');
        dispatch({ type: VIEW_DOCUMENTS, documents: response.data.documents });
      }).catch((error) => {
        console.log(error, 'what error are we having?')
        // console.log(error.response.data.message, 'message');
        dispatch({ type: VIEW_DOCUMENTS_ERROR, error: error.response.data.message || error.response.data });
        console.log(error, 'error');
      });
  };
}
// export default function createDocument(document) {
//   // // Return action
//   // return {
//   //   // Unique identifier
//   //   type: CREATE_DOCUMENT,
//   //   // Payload
//   //   document
//   // };
// }
