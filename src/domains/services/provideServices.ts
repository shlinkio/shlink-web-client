import Bottle from 'bottlejs';
import { ConnectDecorator } from '../../container/types';
import { listDomains } from '../reducers/domainsList';
import { DomainsDropdown } from '../DomainsDropdown';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('DomainsDropdown', () => DomainsDropdown);
  bottle.decorator('DomainsDropdown', connect([ 'domainsList' ], [ 'listDomains' ]));

  // Actions
  bottle.serviceFactory('listDomains', listDomains, 'buildShlinkApiClient');
};

export default provideServices;
