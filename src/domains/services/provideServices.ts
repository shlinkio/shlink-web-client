import Bottle from 'bottlejs';
import { ConnectDecorator } from '../../container/types';
import { checkDomainHealth, filterDomains, listDomains } from '../reducers/domainsList';
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

  // Actions
  bottle.serviceFactory('listDomains', listDomains, 'buildShlinkApiClient');
  bottle.serviceFactory('filterDomains', () => filterDomains);
  bottle.serviceFactory('editDomainRedirects', editDomainRedirects, 'buildShlinkApiClient');
  bottle.serviceFactory('checkDomainHealth', checkDomainHealth, 'buildShlinkApiClient');
};

export default provideServices;
