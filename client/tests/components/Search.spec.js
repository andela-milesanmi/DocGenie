import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Search } from '../../app/components/Search.jsx';

describe('Search Component', () => {
  let component;
  const props = {
    searchForDocuments: sinon.spy(),
  };
  beforeEach(() => {
    component = mount(<Search {...props}/>);
  });
  afterEach(() => {
    props.searchForDocuments.reset();
  });

  it('should find the neccessary dom elements ', () => {
    expect(component.find('.search-docs').length).to.equal(1);
    expect(component.find('input').length).to.equal(1);
  });
  xit('simulates click events', () => {
    component.find('form').simulate('submit', { target: { email: { value: 'test@yahoo.com' },
      password: { value: 'testing' } } });
    expect(props.signInUser).to.have.property('callCount', 1);
  });
});
