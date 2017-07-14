import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { AllUsers } from '../../app/components/AllUsers.jsx';


describe('AllUsers component', () => {
  let component;
  const props = {
    params: {
      page: '3'
    },
    viewAllUsers: sinon.spy(),
    user: { id: 3 },
    users: [],
  };
  beforeEach(() => {
    component = mount(<AllUsers {...props}/>);
  });
  afterEach(() => {
    props.viewAllUsers.reset();
  });
  it('should call the neccessary methods on mount', () => {
    const componentDidMountSpy = sinon.spy(AllUsers.prototype, 'componentDidMount');
    mount(<AllUsers {...props}/>);
    expect(componentDidMountSpy.callCount).to.equal(1);
  });

  it('should have all the set props', () => {
    expect(component.props().user.id).to.equal(3);
    expect(component.props().params.page).to.equal('3');
  });
  it('should find the neccessary dom elements ', () => {
    expect(component.find('table').length).to.equal(1);
  });
});
