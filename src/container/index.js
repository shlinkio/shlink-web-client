import Bottle from 'bottlejs';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick } from 'ramda';
import App from '../App';
import ScrollToTop from '../common/ScrollToTop';
import MainHeader from '../common/MainHeader';
import { resetSelectedServer } from '../servers/reducers/selectedServer';
import Home from '../common/Home';
import store from './store';

const bottle = new Bottle();

bottle.constant('store', store);
bottle.serviceFactory('App', App, 'MainHeader', 'Home');
bottle.serviceFactory('MainHeader', () => withRouter(MainHeader()));
bottle.serviceFactory('ScrollToTop', () => withRouter(ScrollToTop));
bottle.serviceFactory('Home', () => connect(pick([ 'servers' ]), { resetSelectedServer })(Home));

export default bottle.container;
