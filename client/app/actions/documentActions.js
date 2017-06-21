import { CREATE_DOCUMENT } from '../reducers/document';

export default function createDocument(document) {
  // Return action
  return {
    // Unique identifier
    type: CREATE_DOCUMENT,
    // Payload
    document
  };
}
