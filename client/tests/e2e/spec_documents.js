/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/

module.exports = {
  'User sign in and create document success': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', 'muna2@muna2.com')
      .setValue('input[name=password]', 'muna2muna2')
      .click('#signin-button')
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard/documents/all'}`)
      .click('#create-doc-btn')
      .waitForElementVisible('#created-new-document', 5000)
      .pause(1000)
      .setValue('input[name=title]', 'e2e test doc')
      .setValue('select[name=access]', 'Public')
      .setValue('textarea[name=content]', 'new content here')
      .click('#save-doc')
      .pause(1000)
      .end();
  },
};
