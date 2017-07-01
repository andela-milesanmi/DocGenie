import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
// var server = require('../server/app');

chai.use(chaiHttp);

describe('Search', () => {
  it('should fail for an authenticated route', (done) => {
    chai.request('http://localhost:5000')
      .get('/api/search/documents')
      .end((error, response) => {
        expect(response).to.have.status(401);
        done();
      });
  });

  it('should list ALL documents on /api/search/documents GET if token is valid', (done) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMxLCJyb2xlSWQiOjIsImlhdCI6MTQ5ODQ0OTMzMywiZXhwIjoxNDk4NTM1NzMzfQ.s06oITOuofFKQgN_g3kyaXvw6z-V48_PdxP0zo0bJXI';

    chai.request('http://localhost:5000')
      .get('/api/search/documents/the')
      .set('x-access-token', token)
      .end((error, response) => {
        console.log(response.body, "test search response");
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.an('array');
        done();
      });
  });
});
