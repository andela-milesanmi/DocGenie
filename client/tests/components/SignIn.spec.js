import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

// const MyComponent = () => {
//   return <div> Hello world </div>
// }
// describe('<MyComponent />', () => {
//   it('renders three <Foo /> components', () => {
//     const wrapper = mount(<MyComponent />);
//     expect(wrapper.find('div')).to.have.length(1);
//   });
// });

import SignIn from '../../app/components/SignIn.jsx';

xdescribe('SignIn Component', () => {
  it('allows props to be set', () => {
    const wrapper = mount(<SignIn bar="baz" />);
    expect(wrapper.props().bar).to.equal('baz');
    wrapper.setProps({ bar: 'foo' });
    expect(wrapper.props().bar).to.equal('foo');
  });

  it('simulates click events', () => {
    const onSubmit = sinon.spy();
    const wrapper = mount((
      <SignIn onSubmit={onSubmit} />
    ));
    wrapper.find('button').simulate('click');
    expect(onSubmit).to.have.property('callCount', 1);
  });

  // it('calls componentDidMount', () => {
  //   sinon.spy(SignIn.prototype, 'componentDidMount');
  //   const wrapper = mount(<Foo />);
  //   expect(Foo.prototype.componentDidMount).to.have.property('callCount', 1);
  //   Foo.prototype.componentDidMount.restore();
  // });
});
