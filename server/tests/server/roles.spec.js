import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../../models';
import fakeData from '../fakeData/fakeData';
import server from '../../../server';

chai.use(chaiHttp);
// const server = 'http://localhost:3333';

const promisify = (data) => {
  return new Promise((resolve, reject) => {
    chai.request(server)
      .post('/auth/api/users')
      .set('Content-Type', 'application/json')
      .send(data)
      .end((error, response) => {
        if (error) {
          return reject(error);
        }
        return resolve(response.body.token);
      });
  });
};

describe('Roles', () => {
  let adminToken, userToken, testToken, adminRoleId, userRoleId;

  before(() => {
    return models.Role.create(fakeData.adminRole)
      .then((roleData) => {
        fakeData.firstUser.roleId = roleData.dataValues.id;
        return models.Role.create(fakeData.userRole);
      })
      .then(() => {
        return promisify(fakeData.firstUser);
      })
      .then((token) => {
        adminToken = token;
        return promisify(fakeData.secondUser);
      })
      .then((token) => {
        userToken = token;
        return models.Document.bulkCreate(fakeData.bulkDocuments);
      })
      .catch((error) => {
        console.log(error, 'this is an error');
      });
  });
  after(() => {
    return models.Role.sequelize.sync({ force: true });
  });

  it('should validate that a regular user cannot create a new role', (done) => { // <= No done callback
    chai.request(server)
      .get('/api/roles')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(401); // <= Test completes before this runs
        done();
      });
  });

  it('should validate that a regular user cannot delete a role', (done) => {
    chai.request(server)
      .delete('/api/roles/1')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(401);
        done();
      });
  });
  it('should validate that a role that already exists cannot be re-created', (done) => {
    chai.request(server)
      .post('/api/roles/')
      .set('authorization', userToken)
      .send({ title: 'admin' })
      .end((error, response) => {
        expect(response).to.have.status(401);
        done();
      });
  });
});
