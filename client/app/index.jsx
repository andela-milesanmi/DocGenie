import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import Home from './components/Home.jsx';
import AllDocuments from './components/documents/AllDocuments.jsx';
import MyDocuments from './components/documents/MyDocuments.jsx';
import ViewOneDocument from './components/documents/ViewOneDocument.jsx';
import Profile from './components/Profile.jsx';
import AllUsers from './components/users/AllUsers.jsx';
import { getUser } from './actions/userActions';
import './styles/app.scss';
import '../../node_modules/froala-editor/css/froala_style.min.css';
import '../../node_modules/froala-editor/css/froala_editor.pkgd.min.css';

// import '../../node_modules/font-awesome/css/font-awesome.css';

import configureStore from './store/configureStore';

const store = configureStore();

window.clientStore = store;

// solves react-materialize error: '$() is not a function'
window.jQuery = window.$ = jQuery;

const requireAuth = store => (nextState, replace, callback) => {
  const token = localStorage.getItem('token');
  const { user: { currentProfile: { id } = {} } = {} } = store.getState();
  if (token && id && !nextState.location.pathname.includes('dashboard')) {
    replace('/dashboard/documents/all');
    return callback();
  }
  if (token && !id) {
    return store.dispatch(getUser()).then(() => {
      if (!nextState.location.pathname.includes('dashboard')) replace('/dashboard/documents/all');
      return callback();
    }).catch((error) => {
      console.log(error.message, 'error in index.jsx, we are having errors eaefafa');
      if (error.message === 'Token required for access') {
        localStorage.removeItem('token');
      }
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
        <Route path="dashboard/documents/all(/:page)" component={AllDocuments} />
        <Route path="dashboard/documents(/:page)" component={MyDocuments} />
        <Route path="dashboard/documents/view/:id" component={ViewOneDocument} />
        <Route path="dashboard/profile" component={Profile} />
        <Route path="dashboard/users(/:page)" component={AllUsers} />
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('app'));
