import { Action, Dispatch } from 'redux';
import { ProblemDetailsError, ShlinkDomainRedirects } from '../../api/types';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';
import { Domain, DomainStatus } from '../data';
import { hasServerData } from '../../servers/data';
import { replaceAuthorityFromUri } from '../../utils/helpers/uri';
import { EDIT_DOMAIN_REDIRECTS, EditDomainRedirectsAction } from './domainRedirects';

export const LIST_DOMAINS_START = 'shlink/domainsList/LIST_DOMAINS_START';
export const LIST_DOMAINS_ERROR = 'shlink/domainsList/LIST_DOMAINS_ERROR';
export const LIST_DOMAINS = 'shlink/domainsList/LIST_DOMAINS';
export const FILTER_DOMAINS = 'shlink/domainsList/FILTER_DOMAINS';
export const VALIDATE_DOMAIN = 'shlink/domainsList/VALIDATE_DOMAIN';

export interface DomainsList {
  domains: Domain[];
  filteredDomains: Domain[];
  defaultRedirects?: ShlinkDomainRedirects;
  loading: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface ListDomainsAction extends Action<string> {
  domains: Domain[];
  defaultRedirects?: ShlinkDomainRedirects;
}

interface FilterDomainsAction extends Action<string> {
  searchTerm: string;
}

interface ValidateDomain extends Action<string> {
  domain: string;
  status: DomainStatus;
}

const initialState: DomainsList = {
  domains: [],
  filteredDomains: [],
  loading: false,
  error: false,
};

export type DomainsCombinedAction = ListDomainsAction
& ApiErrorAction
& FilterDomainsAction
& EditDomainRedirectsAction
& ValidateDomain;

export const replaceRedirectsOnDomain = (domain: string, redirects: ShlinkDomainRedirects) =>
  (d: Domain): Domain => (d.domain !== domain ? d : { ...d, redirects });

export const replaceStatusOnDomain = (domain: string, status: DomainStatus) =>
  (d: Domain): Domain => (d.domain !== domain ? d : { ...d, status });

export default buildReducer<DomainsList, DomainsCombinedAction>({
  [LIST_DOMAINS_START]: () => ({ ...initialState, loading: true }),
  [LIST_DOMAINS_ERROR]: ({ errorData }) => ({ ...initialState, error: true, errorData }),
  [LIST_DOMAINS]: (_, { domains, defaultRedirects }) =>
    ({ ...initialState, domains, filteredDomains: domains, defaultRedirects }),
  [FILTER_DOMAINS]: (state, { searchTerm }) => ({
    ...state,
    filteredDomains: state.domains.filter(({ domain }) => domain.toLowerCase().match(searchTerm)),
  }),
  [EDIT_DOMAIN_REDIRECTS]: (state, { domain, redirects }) => ({
    ...state,
    domains: state.domains.map(replaceRedirectsOnDomain(domain, redirects)),
    filteredDomains: state.filteredDomains.map(replaceRedirectsOnDomain(domain, redirects)),
  }),
  [VALIDATE_DOMAIN]: (state, { domain, status }) => ({
    ...state,
    domains: state.domains.map(replaceStatusOnDomain(domain, status)),
    filteredDomains: state.filteredDomains.map(replaceStatusOnDomain(domain, status)),
  }),
}, initialState);

export const listDomains = (buildShlinkApiClient: ShlinkApiClientBuilder) => () => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch({ type: LIST_DOMAINS_START });
  const { listDomains: shlinkListDomains } = buildShlinkApiClient(getState);

  try {
    const resp = await shlinkListDomains().then(({ data, defaultRedirects }) => ({
      domains: data.map((domain): Domain => ({ ...domain, status: 'validating' })),
      defaultRedirects,
    }));

    dispatch<ListDomainsAction>({ type: LIST_DOMAINS, ...resp });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: LIST_DOMAINS_ERROR, errorData: parseApiError(e) });
  }
};

export const filterDomains = (searchTerm: string): FilterDomainsAction => ({ type: FILTER_DOMAINS, searchTerm });

export const checkDomainHealth = (buildShlinkApiClient: ShlinkApiClientBuilder) => (domain: string) => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const { selectedServer } = getState();

  if (!hasServerData(selectedServer)) {
    dispatch<ValidateDomain>({ type: VALIDATE_DOMAIN, domain, status: 'invalid' });

    return;
  }

  try {
    const { url, ...rest } = selectedServer;
    const { health } = buildShlinkApiClient({
      ...rest,
      url: replaceAuthorityFromUri(url, domain),
    });

    const { status } = await health();

    dispatch<ValidateDomain>({ type: VALIDATE_DOMAIN, domain, status: status === 'pass' ? 'valid' : 'invalid' });
  } catch (e) {
    dispatch<ValidateDomain>({ type: VALIDATE_DOMAIN, domain, status: 'invalid' });
  }
};
