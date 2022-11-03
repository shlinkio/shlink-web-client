import { prop } from 'ramda';
import Bottle from 'bottlejs';
import { ConnectDecorator } from '../../container/types';
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
  bottle.serviceFactory('domainsListReducerCreator', domainsListReducerCreator, 'buildShlinkApiClient');
  bottle.serviceFactory('domainsListReducer', prop('reducer'), 'domainsListReducerCreator'); // TODO Improve type checks on the prop that gets picked here

  // Actions
  bottle.serviceFactory('listDomains', prop('listDomains'), 'domainsListReducerCreator'); // TODO Improve type checks on the prop that gets picked here
  bottle.serviceFactory('filterDomains', prop('filterDomains'), 'domainsListReducerCreator'); // TODO Improve type checks on the prop that gets picked here
  bottle.serviceFactory('editDomainRedirects', editDomainRedirects, 'buildShlinkApiClient');
  bottle.serviceFactory('checkDomainHealth', prop('checkDomainHealth'), 'domainsListReducerCreator'); // TODO Improve type checks on the prop that gets picked here
};

export default provideServices;
