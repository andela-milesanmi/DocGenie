import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../../models';
import mockData from '../mockData/mockData';
import server from '../../../server';

chai.use(chaiHttp);

const getUserToken = (data) => {
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
    return models.Role.create(mockData.adminRole)
      .then((roleData) => {
        mockData.firstUser.roleId = roleData.dataValues.id;
        return models.Role.create(mockData.userRole);
      })
      .then(() => {
        return getUserToken(mockData.firstUser);
      })
      .then((token) => {
        adminToken = token;
        return getUserToken(mockData.secondUser);
      })
      .then((token) => {
        userToken = token;
        return models.Document.bulkCreate(mockData.bulkDocuments);
      })
      .catch((error) => {
        console.log(error, 'this is an error');
      });
  });
  after(() => {
    return models.Role.sequelize.sync({ force: true });
  });

  it('should validate that a regular user cannot create a new role', (done) => {
    chai.request(server)
      .get('/api/roles')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(401);
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
