import Bottle from 'bottlejs';
import { withRouter } from 'react-router-dom';
import { connect as reduxConnect } from 'react-redux';
import { pick } from 'ramda';
import App from '../App';
import provideCommonServices from '../common/services/provideServices';
import provideShortUrlsServices from '../short-urls/services/provideServices';
import provideServersServices from '../servers/services/provideServices';
import provideVisitsServices from '../visits/services/provideServices';
import provideTagsServices from '../tags/services/provideServices';
import provideUtilsServices from '../utils/services/provideServices';
import provideMercureServices from '../mercure/services/provideServices';
import provideSettingsServices from '../settings/services/provideServices';

const bottle = new Bottle();
const { container } = bottle;

const lazyService = (container, serviceName) => (...args) => container[serviceName](...args);
const mapActionService = (map, actionName) => ({
  ...map,

  // Wrap actual action service in a function so that it is lazily created the first time it is called
  [actionName]: lazyService(container, actionName),
});
const connect = (propsFromState, actionServiceNames = []) =>
  reduxConnect(
    propsFromState ? pick(propsFromState) : null,
    actionServiceNames.reduce(mapActionService, {})
  );

bottle.serviceFactory('App', App, 'MainHeader', 'Home', 'MenuLayout', 'CreateServer', 'EditServer', 'Settings');
bottle.decorator('App', connect([ 'servers' ], [ 'fetchServers' ]));

provideCommonServices(bottle, connect, withRouter);
provideShortUrlsServices(bottle, connect);
provideServersServices(bottle, connect, withRouter);
provideTagsServices(bottle, connect);
provideVisitsServices(bottle, connect);
provideUtilsServices(bottle);
provideMercureServices(bottle);
provideSettingsServices(bottle, connect);

export default container;
