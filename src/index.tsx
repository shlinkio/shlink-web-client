import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import pack from '../package.json';
import { container } from './container';
import { store } from './container/store';
import { fixLeafletIcons } from './utils/helpers/leaflet';
import { register as registerServiceWorker } from './serviceWorkerRegistration';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import './index.scss';

// This overwrites icons used for leaflet maps, fixing some issues caused by webpack while processing the CSS
fixLeafletIcons();

const { App, ScrollToTop, ErrorHandler, appUpdateAvailable } = container;

createRoot(document.getElementById('root')!).render( // eslint-disable-line @typescript-eslint/no-non-null-assertion
  <Provider store={store}>
    <BrowserRouter basename={pack.homepage}>
      <ErrorHandler>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </ErrorHandler>
    </BrowserRouter>
  </Provider>,
);

// Learn more about service workers: https://cra.link/PWA
registerServiceWorker({
  onUpdate() {
    store.dispatch(appUpdateAvailable());
  },
});
