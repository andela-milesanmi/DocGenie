import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import Home from './components/Home.jsx';
import AllDocuments from './components/documents/AllDocuments.jsx';
import { getUser } from './actions/userActions';
import './styles/app.scss';

import configureStore from './store/configureStore';

const store = configureStore();

window.clientStore = store;

const requireAuth = store => (nextState, replace, callback) => {
  const token = localStorage.getItem('token');
  if (token && store.getState().user.id && nextState.location.pathname.includes('dashboard')) {
    return callback();
  }
  if (token && !store.getState().user.id) {
    return store.dispatch(getUser()).then(() => {
      if (!nextState.location.pathname.includes('dashboard')) replace('/dashboard');
      return callback();
    }).catch(() => {
      replace('/');
      return callback();
    });
  }
  if (!token && nextState.location.pathname.includes('dashboard')) {
    replace('/');
    return callback();
  }
  return callback();
};

const Root = () => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={requireAuth(store)}>
        <IndexRoute component={Home} />
        <Route path="/dashboard" component={AllDocuments} />
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('app'));
