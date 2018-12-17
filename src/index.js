import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { homepage } from '../package.json';
import registerServiceWorker from './registerServiceWorker';
import container from './container';
import store from './container/store';
import '../node_modules/react-datepicker/dist/react-datepicker.css';
import './common/react-tagsinput.scss';
import './index.scss';

const { App, ScrollToTop } = container;

render(
  <Provider store={store}>
    <BrowserRouter basename={homepage}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
