import faker from 'faker';
import bcrypt from 'bcrypt';

export default {
  firstUser: {
    username: 'admin',
    fullname: 'admin tester',
    email: faker.internet.email(),
    password: 'admintester',
    roleId: 1,
  },
  secondUser: {
    username: faker.internet.userName(),
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  thirdUser: {
    username: faker.internet.userName(),
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  privateDocument: {
    title: 'private document',
    content: 'private document created',
    access: -1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  roleDocument: {
    title: 'public document',
    content: 'public document created',
    access: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  publicDocument: {
    title: faker.lorem.words(),
    content: faker.lorem.paragraph(),
    access: 0,
    userId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  sampleDocument: {
    title: faker.lorem.words(),
    content: faker.lorem.paragraph(),
    access: -1,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  editorOne: {
    username: 'janey',
    fullname: 'jane doe',
    email: faker.internet.email(),
    password: bcrypt.hashSync('janey', bcrypt.genSaltSync(8)),
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  editorTwo: {
    fullname: faker.name.findName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync('hacksaw', bcrypt.genSaltSync(8)),
    roleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  invalidUserDetails: {
    username: faker.internet.userName(),
    fullname: faker.name.findName(),
    email: 'tuna@gmail.com',
    password: faker.internet.password(),
    roleId: 2
  },
  invalidToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZUlkIjoyLCJpYXQiOjE0OTM2MjQ5MTcsImV4cCI6MTQ5MzcxMTMxN30.A3dy4bPUEa3QsML03UKDjqC9wcmAjV0ub8aWu1niaL',
  roleOne: {
    title: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  roleTwo: {
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
