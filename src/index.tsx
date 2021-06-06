import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { homepage } from '../package.json';
import container from './container';
import store from './container/store';
import { fixLeafletIcons } from './utils/helpers/leaflet';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
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
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
