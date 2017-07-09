import { expect } from 'chai';
import { VIEW_DOCUMENTS, CREATE_DOCUMENT, CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT,
  CREATE_DOCUMENT_ERROR, DELETE_DOCUMENT,
  SEARCH_DOCUMENT } from '../../app/actionTypes';
import reducer from '../../app/reducers/document';
import fakeData from '../../../server/tests/fakeData/fakeData';

describe('Documents reducer', () => {
  it('should handle VIEW_DOCUMENTS', () => {
    expect(
      reducer({}, {
        type: VIEW_DOCUMENTS,
        documents: fakeData.bulkDocuments
      })
    ).to.eql(
      {
        documents: fakeData.bulkDocuments,
        error: ''
      }
    );
  });
  it('should handle CREATE_DOCUMENT', () => {
    expect(
      reducer({}, {
        type: CREATE_DOCUMENT,
        document: fakeData.publicDocument
      })
    ).to.eql({
      documents: [fakeData.publicDocument],
      error: ''
    });
  });
  it('should handle CREATE_DOCUMENT_ERROR', () => {
    expect(
      reducer({}, {
        type: CREATE_DOCUMENT_ERROR,
        errorMessage: 'error while creating new document'
      })
    ).to.eql({
      error: 'error while creating new document'
    });
  });

  it('should handle CHANGE_CURRENT_DOCUMENT', () => {
    expect(
      reducer({}, {
        type: CHANGE_CURRENT_DOCUMENT,
        document: fakeData.publicDocument
      })
    ).to.eql({
      currentDocument: fakeData.publicDocument,
      error: ''
    });
  });
  it('should handle EDIT_DOCUMENT', () => {
    expect(
      reducer({}, {
        type: EDIT_DOCUMENT,
        document: fakeData.publicDocument
      })
    ).to.eql({
      documents: [fakeData.publicDocument],
      error: ''
    });
  });
  it('should handle SEARCH_DOCUMENT', () => {
    expect(
      reducer({}, {
        type: SEARCH_DOCUMENT,
        documents: fakeData.publicDocument
      })
    ).to.eql({
      documents: fakeData.publicDocument,
      error: ''
    });
  });

  it('should handle DELETE_DOCUMENT', () => {
    expect(
      reducer({ documents: [fakeData.testPublicDocument, { a: 1, b: 2 }] }, {
        type: DELETE_DOCUMENT,
        document: fakeData.testPublicDocument
      })
    ).to.eql({
      documents: [{ a: 1, b: 2 }],
      error: ''
    });
  });
});
