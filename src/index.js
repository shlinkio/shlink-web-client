import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { homepage } from '../package.json';
import registerServiceWorker from './registerServiceWorker';
import container from './container';
import store from './container/store';
import { fixLeafletIcons } from './utils/utils';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import './common/react-tagsinput.scss';
import './index.scss';

// This overwrites icons used for leaflet maps, fixing some issues caused by webpack while processing the CSS
fixLeafletIcons();

const { App, ScrollToTop, ErrorHandler } = container;

render(
  <Provider store={store}>
    <BrowserRouter basename={homepage}>
      <ErrorHandler>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </ErrorHandler>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
