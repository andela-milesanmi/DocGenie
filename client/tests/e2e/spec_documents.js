/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/

module.exports = {
  'User sign in and create document': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .pause(2000)
      .setValue('input[name=email]', 'muna2@muna2.com')
      .setValue('input[name=password]', 'muna2muna2')
      .click('#signin-button')
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard'}`)
      .click('#create-doc-btn')
      .waitForElementVisible('#created-new-document', 5000)
      .pause(1000)
      .waitForElementVisible('.fr-box', 5000)
      .setValue('input[name=title]', 'e2e test doc')
      .setValue('select[name=access]', 'Public')
      .waitForElementVisible('.fr-element', 3000)
      .waitForElementVisible('.fr-view', 3000)
      .setValue('div.fr-element', 'froala content here')
      .click('#save-doc')
      .pause(1000);
  },
  'Edit document': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .pause(1000)
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard'}`)
      .waitForElementVisible('div[id="form-card-action"]', 5000)
      .waitForElementVisible('#edit', 5000)
      .click('#edit')
      .pause(1000)
      .waitForElementVisible('.fr-box', 5000)
      .setValue('input[name=title]', 'e2e test doc edited')
      .setValue('select[name=access]', 'Private')
      .waitForElementVisible('.fr-element', 3000)
      .waitForElementVisible('.fr-view', 3000)
      .setValue('div.fr-element', 'froala content edited')
      .click('#save-doc')
      .pause(1000);
  },
  'View a document': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .pause(1000)
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard'}`)
      .waitForElementVisible('div[id="form-card-action"]', 5000)
      .waitForElementVisible('#show-more', 5000)
      .click('#show-more')
      .pause(1000)
      .waitForElementVisible('.viewOneDocument', 5000)
      .pause(1000);
  },
  'Delete document': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .pause(1000)
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard'}`)
      .waitForElementVisible('div[id="form-card-action"]', 5000)
      .waitForElementVisible('#delete', 5000)
      .click('#delete')
      .pause(1000)
      .waitForElementVisible('.sweet-alert', 3000)
      .pause(1000)
      .click('.confirm')
      .pause(1000);
  },
  'Search document': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .pause(1000)
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard'}`)
      .waitForElementVisible('div[id="search-docs"]', 5000)
      .setValue('input[name=searchKey]', 'e2e test doc')
      .pause(3000)
      .setValue('input[name=searchKey]', '')
      .pause(3000)
      .end();
  },
};
