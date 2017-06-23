import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import Home from './components/Home.jsx';
import AllDocuments from './components/documents/AllDocuments.jsx';
import './styles/app.scss';

import configureStore from './store/configureStore';

const store = configureStore();

window.clientStore = store;

const Root = () => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/dashboard" component={AllDocuments} />
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('app'));
