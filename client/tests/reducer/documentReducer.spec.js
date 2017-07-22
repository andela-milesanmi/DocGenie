import { expect } from 'chai';
import { VIEW_DOCUMENTS, CREATE_DOCUMENT, CHANGE_CURRENT_DOCUMENT, EDIT_DOCUMENT,
  CREATE_DOCUMENT_ERROR, DELETE_DOCUMENT,
  SEARCH_DOCUMENT } from '../../app/actionTypes';
import reducer from '../../app/reducers/document';
import mockData from '../../../server/tests/mockData/mockData';

describe('Documents reducer', () => {
  it('should handle VIEW_DOCUMENTS', () => {
    expect(
      reducer({}, {
        type: VIEW_DOCUMENTS,
        documents: mockData.bulkDocuments
      })
    ).to.eql(
      {
        documents: mockData.bulkDocuments,
        error: ''
      }
    );
  });
  it('should handle CREATE_DOCUMENT', () => {
    expect(
      reducer({}, {
        type: CREATE_DOCUMENT,
        document: mockData.publicDocument
      })
    ).to.eql({
      documents: [mockData.publicDocument],
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
        document: mockData.publicDocument
      })
    ).to.eql({
      currentDocument: mockData.publicDocument,
      error: ''
    });
  });
  it('should handle EDIT_DOCUMENT', () => {
    expect(
      reducer({}, {
        type: EDIT_DOCUMENT,
        document: mockData.publicDocument
      })
    ).to.eql({
      documents: [mockData.publicDocument],
      error: ''
    });
  });
  it('should handle SEARCH_DOCUMENT', () => {
    expect(
      reducer({}, {
        type: SEARCH_DOCUMENT,
        documents: mockData.publicDocument
      })
    ).to.eql({
      documents: mockData.publicDocument,
      error: ''
    });
  });

  it('should handle DELETE_DOCUMENT', () => {
    expect(
      reducer({ documents: [mockData.testPublicDocument, { a: 1, b: 2 }] }, {
        type: DELETE_DOCUMENT,
        document: mockData.testPublicDocument
      })
    ).to.eql({
      documents: [{ a: 1, b: 2 }],
      error: ''
    });
  });
});
