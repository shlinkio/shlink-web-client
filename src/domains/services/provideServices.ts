import { prop } from 'ramda';
import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container/types';
import { domainsListReducerCreator } from '../reducers/domainsList';
import { DomainSelector } from '../DomainSelector';
import { ManageDomains } from '../ManageDomains';
import { editDomainRedirects } from '../reducers/domainRedirects';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('DomainSelector', () => DomainSelector);
  bottle.decorator('DomainSelector', connect(['domainsList'], ['listDomains']));

  bottle.serviceFactory('ManageDomains', () => ManageDomains);
  bottle.decorator('ManageDomains', connect(
    ['domainsList', 'selectedServer'],
    ['listDomains', 'filterDomains', 'editDomainRedirects', 'checkDomainHealth'],
  ));

  // Reducer
  bottle.serviceFactory(
    'domainsListReducerCreator',
    domainsListReducerCreator,
    'buildShlinkApiClient',
    'editDomainRedirects',
  );
  bottle.serviceFactory('domainsListReducer', prop('reducer'), 'domainsListReducerCreator');

  // Actions
  bottle.serviceFactory('listDomains', prop('listDomains'), 'domainsListReducerCreator');
  bottle.serviceFactory('filterDomains', prop('filterDomains'), 'domainsListReducerCreator');
  bottle.serviceFactory('editDomainRedirects', editDomainRedirects, 'buildShlinkApiClient');
  bottle.serviceFactory('checkDomainHealth', prop('checkDomainHealth'), 'domainsListReducerCreator');
};

export default provideServices;
