import { Action, Dispatch } from 'redux';
import { ShlinkDomain } from '../../api/types';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';

/* eslint-disable padding-line-between-statements */
export const LIST_DOMAINS_START = 'shlink/domainsList/LIST_DOMAINS_START';
export const LIST_DOMAINS_ERROR = 'shlink/domainsList/LIST_DOMAINS_ERROR';
export const LIST_DOMAINS = 'shlink/domainsList/LIST_DOMAINS';
/* eslint-enable padding-line-between-statements */

export interface DomainsList {
  domains: ShlinkDomain[];
  loading: boolean;
  error: boolean;
}

export interface ListDomainsAction extends Action<string> {
  domains: ShlinkDomain[];
}

const initialState: DomainsList = {
  domains: [],
  loading: false,
  error: false,
};

export default buildReducer<DomainsList, ListDomainsAction>({
  [LIST_DOMAINS_START]: () => ({ ...initialState, loading: true }),
  [LIST_DOMAINS_ERROR]: () => ({ ...initialState, error: true }),
  [LIST_DOMAINS]: (_, { domains }) => ({ ...initialState, domains }),
}, initialState);

export const listDomains = (buildShlinkApiClient: ShlinkApiClientBuilder) => () => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch({ type: LIST_DOMAINS_START });
  const { listDomains } = buildShlinkApiClient(getState);

  try {
    const domains = await listDomains();

    dispatch<ListDomainsAction>({ type: LIST_DOMAINS, domains });
  } catch (e) {
    dispatch({ type: LIST_DOMAINS_ERROR });
  }
};
