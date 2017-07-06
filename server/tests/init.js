const dotenv = require('dotenv');

dotenv.config();

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.document = dom.window.document;
global.window = document.defaultView;

const exposedProperties = ['window', 'navigator', 'document'];

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.HTMLElement = window.HTMLElement;

global.$ = () => ({
  modal: () => null,
  dropdown: () => null,
  sideNav: () => null,
});
global.localStorage = {
  getItem() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVJZCI6MSwiaWF0IjoxNDk4Nzc5ODY1LCJleHAiOjE0OTg4NjYyNjV9.kAL9MtQNzhCwifkegup-DAeQllXi7bMoXvdMYHEQLrc';
  },
  setItem() {
    return null;
  },
  removeItem() {
    return null;
  }
};

const noop = () => null;

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.md'] = noop;
require.extensions['.png'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.gif'] = noop;
