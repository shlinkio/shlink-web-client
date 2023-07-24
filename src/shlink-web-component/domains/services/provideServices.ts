import type Bottle from 'bottlejs';
import { prop } from 'ramda';
import type { ConnectDecorator } from '../../container';
import { DomainSelector } from '../DomainSelector';
import { ManageDomains } from '../ManageDomains';
import { editDomainRedirects } from '../reducers/domainRedirects';
import { domainsListReducerCreator } from '../reducers/domainsList';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('DomainSelector', () => DomainSelector);
  bottle.decorator('DomainSelector', connect(['domainsList'], ['listDomains']));

  bottle.serviceFactory('ManageDomains', () => ManageDomains);
  bottle.decorator('ManageDomains', connect(
    ['domainsList'],
    ['listDomains', 'filterDomains', 'editDomainRedirects', 'checkDomainHealth'],
  ));

  // Reducer
  bottle.serviceFactory(
    'domainsListReducerCreator',
    domainsListReducerCreator,
    'apiClient',
    'editDomainRedirects',
  );
  bottle.serviceFactory('domainsListReducer', prop('reducer'), 'domainsListReducerCreator');

  // Actions
  bottle.serviceFactory('listDomains', prop('listDomains'), 'domainsListReducerCreator');
  bottle.serviceFactory('filterDomains', prop('filterDomains'), 'domainsListReducerCreator');
  bottle.serviceFactory('editDomainRedirects', editDomainRedirects, 'apiClient');
  bottle.serviceFactory('checkDomainHealth', prop('checkDomainHealth'), 'domainsListReducerCreator');
};
