import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
// import server from '../../../server';

chai.use(chaiHttp);

describe('Search', () => {
  it('should fail for an authenticated route', (done) => {
    chai.request('http://localhost:5000')
      .get('/api/search/documents')
      .end((error, response) => {
        expect(response).to.have.status(403);
        done();
      });
  });

  it('should list ALL documents on /api/search/documents GET if token is valid', (done) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVJZCI6MSwiaWF0IjoxNDk4Nzg4MzAzLCJleHAiOjE0OTg4NzQ3MDN9.qXrygZKbzGOMjpL5UssxTJWc7ynePBMzNbUmx4fdFOk';

    chai.request('http://localhost:5000')
      .get('/api/search/documents/the')
      .set('authorization', token)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.an('array');
        done();
      });
  });
});
