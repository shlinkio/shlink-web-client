import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import App from './App';
import './index.scss';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';

// const store = createStore(reducers, {}, applyMiddleware());
const store = createStore(reducers, applyMiddleware());

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
