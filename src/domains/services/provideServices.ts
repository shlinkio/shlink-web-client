import type Bottle from 'bottlejs';
import { prop } from 'remeda';
import type { ConnectDecorator } from '../../container/types';
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
