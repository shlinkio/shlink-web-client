import Bottle from 'bottlejs';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pick } from 'ramda';
import App from '../App';
import ScrollToTop from '../common/ScrollToTop';
import MainHeader from '../common/MainHeader';
import { resetSelectedServer, selectServer } from '../servers/reducers/selectedServer';
import Home from '../common/Home';
import MenuLayout from '../common/MenuLayout';
import { createServer } from '../servers/reducers/server';
import CreateServer from '../servers/CreateServer';
import store from './store';

const bottle = new Bottle();

bottle.constant('store', store);
bottle.serviceFactory('ScrollToTop', () => withRouter(ScrollToTop));
bottle.serviceFactory('MainHeader', () => withRouter(MainHeader()));
bottle.serviceFactory('Home', () => connect(pick([ 'servers' ]), { resetSelectedServer })(Home));
bottle.serviceFactory(
  'MenuLayout',
  () => compose(
    connect(pick([ 'selectedServer', 'shortUrlsListParams' ]), { selectServer }),
    withRouter
  )(MenuLayout)
);
bottle.serviceFactory(
  'CreateServer',
  () => connect(
    pick([ 'selectedServer' ]),
    { createServer, resetSelectedServer }
  )(CreateServer)
);
bottle.serviceFactory('App', App, 'MainHeader', 'Home', 'MenuLayout', 'CreateServer');

export default bottle.container;
