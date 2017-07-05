import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import CreateDocument from '../../app/components/documents/CreateDocument.jsx';
import { AllDocuments } from '../../app/components/documents/AllDocuments.jsx';
import fakeData from '../../../server/tests/fakeData/fakeData';


describe('AllDocuments component', () => {
  const mockStore = configureStore([thunk]);
  let component;
  const store = mockStore({ documents: {}, user: { currentProfile: { id: 10 } } });
  const props = {
    documents: [],
    currentPage: 1,
    pages: 4,
    params: {
      page: '3'
    },
    viewAllDocuments: sinon.spy(),
    changeCurrentDocument: sinon.spy(),
    user: { id: 3 },
  };
  beforeEach(() => {
    component = mount(<AllDocuments {...props}/>, {
      context: { store },
      childContextTypes: {
        store: React.PropTypes.object
      }
    });
  });
  afterEach(() => {
    props.viewAllDocuments.reset();
    props.changeCurrentDocument.reset();
  });

  it('should have all the set props', () => {
    expect(component.props().pages).to.equal(4);
    expect(component.props().currentPage).to.equal(1);
  });
  it('should have the required states', () => {
    expect(component.state().currentUrl).to.equal('/api/documents/?page=');
  });
  it('should call the neccessary methods on mount', () => {
    const componentDidMountSpy = sinon.spy(AllDocuments.prototype, 'componentDidMount');
    mount(<AllDocuments {...props}/>, {
      context: { store },
      childContextTypes: {
        store: React.PropTypes.object
      }
    });
    expect(componentDidMountSpy.callCount).to.equal(1);
  });
  it('should find the neccessary dom elements ', () => {
    expect(component.find(CreateDocument).length).to.equal(1);
    expect(component.find('.dashboard-container').length).to.equal(1);
  });
  it('should call editDocument props on call', () => {
    component.find('.create-doc').last().simulate('click');
    expect(props.changeCurrentDocument.callCount).to.equal(1);
  });
  it('should fetch all a user\'s own documents on button-click', () => {
    component.find('#ownDocuments').simulate('click');
    expect(component.state().currentUrl).to.equal(`/api/users/${props.user.id}/documents/?page=`);
    expect(props.viewAllDocuments.callCount).to.equal(2);
  });
});
/* it('allows props to be set', () => {
    const wrapper = shallow(
      <AllDocuments dispatch={dispatch} store={mockStore({ runtime: {} })}
        documents={{ id: 1, userId: 2, title: 'test doc', content: 'test content' }}
        currentPage={Number(1)} pages={Number(1)} params="" viewAllDocuments={viewAllDocuments}
        user={fakeData.secondUser}
      />
    );
    expect(wrapper.props().documents.title).to.equal('test doc');
    wrapper.setProps({ documents: { title: 'foo' } });
    expect(wrapper.props().documents.title).to.equal('foo');
  });

  it('simulates click events', () => {
    const showAllDocuments = sinon.spy();
    const wrapper = mount((
      <AllDocuments showAllDocuments={showAllDocuments} />, { context: { store: mockStore() } }
    ));
    wrapper.find('button').simulate('click');
    expect(showAllDocuments).to.have.property('callCount', 1);
  });

  it('calls componentDidMount', () => {
    sinon.spy(AllDocuments.prototype, 'componentDidMount');
    const wrapper = mount(<AllDocuments />, { context: { store: mockStore() } });
    expect(AllDocuments.prototype.componentDidMount).to.have.property('callCount', 1);
    AllDocuments.prototype.componentDidMount.restore();
  });*/
// });
