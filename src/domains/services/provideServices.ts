import Bottle from 'bottlejs';
import { ConnectDecorator } from '../../container/types';
import { listDomains } from '../reducers/domainsList';
import { DomainSelector } from '../DomainSelector';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('DomainSelector', () => DomainSelector);
  bottle.decorator('DomainSelector', connect([ 'domainsList' ], [ 'listDomains' ]));

  // Actions
  bottle.serviceFactory('listDomains', listDomains, 'buildShlinkApiClient');
};

export default provideServices;
