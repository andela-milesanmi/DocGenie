import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

const MyComponent = () => {
  return <div> Hello world </div>
}
describe('<MyComponent />', () => {
  it('renders three <Foo /> components', () => {
    const wrapper = mount(<MyComponent />);
    expect(wrapper.find('div')).to.have.length(1);
  });
});
