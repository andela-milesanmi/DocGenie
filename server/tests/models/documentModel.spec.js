import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import fakeData from '../fakeData/fakeData';

const Document = require('../../models/document').Document;


const { sampleDocument } = fakeData;
chai.use(chaiHttp);

describe('Document Model', () => {
  describe('#Create Document', () => {
    it('should create a document', (done) => {
      return Document.create(sampleDocument)
        .then((document) => {
          expect(document.title).to.equal(sampleDocument.title);
          expect(document.content).to.equal(sampleDocument.content);
          done();
        });
    });

    it('should fail if title already exist', (done) => {
      return Document.create(sampleDocument)
        .then()
        .catch((error) => {
          expect(error.errors[0].message).to.equal('Title already exist');
          expect(error.errors[0].type).to.equal('unique violation');
          done();
        });
    });

    it('should fail if title was not provided', (done) => {
      sampleDocument.title = '';
      return Document.create(sampleDocument)
        .then()
        .catch((error) => {
          expect(error.errors[0].message).to.equal('Title cannot be empty');
          done();
        });
    });

    it('should fail if content was not provided', (done) => {
      sampleDocument.title = 'sample title';
      sampleDocument.content = '';
      return Document.create(sampleDocument)
        .then()
        .catch((error) => {
          expect(error.errors[0].message).to.equal('Content cannot be empty');
          done();
        });
    });
  });
});
