import faker from 'faker';
import bcrypt from 'bcrypt';

export default {
  firstUser: {
    username: 'muna',
    fullname: 'muna',
    email: faker.internet.email(),
    password: 'munamuna',
    roleId: 1,
  },
  secondUser: {
    username: faker.internet.userName(),
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: 2,
    about: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  thirdUser: {
    username: faker.internet.userName(),
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: 2,
    about: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  privateDocument: {
    title: 'private document',
    content: 'private document2',
    access: 'private',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  roleDocument: {
    title: 'public document',
    content: 'public document created',
    access: 'public',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  sampleDocument: {
    title: faker.lorem.words(),
    content: faker.lorem.paragraph(),
    access: 'private',
    userId: 1,
    username: 'seyi',
    userRoleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  editorOne: {
    username: 'muna',
    fullname: 'muna',
    email: faker.internet.email(),
    password: bcrypt.hashSync('munamuna', bcrypt.genSaltSync(8)),
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  editorTwo: {
    fullName: faker.name.fullname(),
    email: faker.internet.email(),
    password: bcrypt.hashSync('muna2muna2', bcrypt.genSaltSync(8)),
    roleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  invalidUserDetails: {
    username: faker.internet.userName(),
    fullName: faker.name.findName(),
    email: 'munamuna@gmail.com',
    password: faker.internet.password(),
    roleId: 2
  },
  invalidToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZUlkIjoyLCJpYXQiOjE0OTM2MjQ5MTcsImV4cCI6MTQ5MzcxMTMxN30.A3dy4bPUEa3QsML03UKDjqC9wcmAjV0ub8aWu1niaL',
  roleOne: {
    title: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  admin: {
    title: 'admin',
  },
  user: {
    title: 'user',
  }
};
