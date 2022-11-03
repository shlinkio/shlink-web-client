import { createSlice, PayloadAction, createAsyncThunk, SliceCaseReducers } from '@reduxjs/toolkit';
import { ShlinkDomainRedirects } from '../../api/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ShlinkState } from '../../container/types';
import { Domain, DomainStatus } from '../data';
import { hasServerData } from '../../servers/data';
import { replaceAuthorityFromUri } from '../../utils/helpers/uri';
import { EDIT_DOMAIN_REDIRECTS, EditDomainRedirectsAction } from './domainRedirects';
import { ProblemDetailsError } from '../../api/types/errors';
import { parseApiError } from '../../api/utils';

export const LIST_DOMAINS = 'shlink/domainsList/LIST_DOMAINS';
export const VALIDATE_DOMAIN = 'shlink/domainsList/VALIDATE_DOMAIN';

export interface DomainsList {
  domains: Domain[];
  filteredDomains: Domain[];
  defaultRedirects?: ShlinkDomainRedirects;
  loading: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

interface ListDomains {
  domains: Domain[];
  defaultRedirects?: ShlinkDomainRedirects;
}

interface ValidateDomain {
  domain: string;
  status: DomainStatus;
}

type ListDomainsAction = PayloadAction<ListDomains>;
type FilterDomainsAction = PayloadAction<string>;
type ValidateDomainAction = PayloadAction<ValidateDomain>;

export type DomainsCombinedAction = ListDomainsAction
& FilterDomainsAction
& EditDomainRedirectsAction
& ValidateDomainAction;

const initialState: DomainsList = {
  domains: [],
  filteredDomains: [],
  loading: false,
  error: false,
};

export const replaceRedirectsOnDomain = (domain: string, redirects: ShlinkDomainRedirects) =>
  (d: Domain): Domain => (d.domain !== domain ? d : { ...d, redirects });

export const replaceStatusOnDomain = (domain: string, status: DomainStatus) =>
  (d: Domain): Domain => (d.domain !== domain ? d : { ...d, status });

export const domainsListReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder) => {
  const listDomains = createAsyncThunk<ListDomains, void, { state: ShlinkState }>(
    LIST_DOMAINS,
    async (_, { getState }) => {
      const { listDomains: shlinkListDomains } = buildShlinkApiClient(getState);
      const { data, defaultRedirects } = await shlinkListDomains();

      return {
        domains: data.map((domain): Domain => ({ ...domain, status: 'validating' })),
        defaultRedirects,
      };
    },
  );

  const checkDomainHealth = createAsyncThunk<ValidateDomain, string, { state: ShlinkState }>(
    VALIDATE_DOMAIN,
    async (domain: string, { getState }) => {
      const { selectedServer } = getState();

      if (!hasServerData(selectedServer)) {
        return { domain, status: 'invalid' };
      }

      try {
        const { url, ...rest } = selectedServer;
        const { health } = buildShlinkApiClient({
          ...rest,
          url: replaceAuthorityFromUri(url, domain),
        });

        const { status } = await health();

        return { domain, status: status === 'pass' ? 'valid' : 'invalid' };
      } catch (e) {
        return { domain, status: 'invalid' };
      }
    },
  );

  const { actions, reducer } = createSlice<DomainsList, SliceCaseReducers<DomainsList>>({
    name: 'domainsList',
    initialState,
    reducers: {
      filterDomains: (state, { payload }) => ({
        ...state,
        filteredDomains: state.domains.filter(({ domain }) => domain.toLowerCase().match(payload.toLowerCase())),
      }),
    },
    extraReducers: (builder) => {
      builder.addCase(listDomains.pending, () => ({ ...initialState, loading: true }));
      builder.addCase(listDomains.rejected, (_, { error }) => (
        { ...initialState, error: true, errorData: parseApiError(error) }
      ));
      builder.addCase(listDomains.fulfilled, (_, { payload }) => (
        { ...initialState, ...payload, filteredDomains: payload.domains }
      ));

      builder.addCase(checkDomainHealth.fulfilled, ({ domains, filteredDomains, ...rest }, { payload }) => ({
        ...rest,
        domains: domains.map(replaceStatusOnDomain(payload.domain, payload.status)),
        filteredDomains: filteredDomains.map(replaceStatusOnDomain(payload.domain, payload.status)),
      }));

      builder.addCase(EDIT_DOMAIN_REDIRECTS, (state, { domain, redirects }: any) => ({ // TODO Fix this "any"
        ...state,
        domains: state.domains.map(replaceRedirectsOnDomain(domain, redirects)),
        filteredDomains: state.filteredDomains.map(replaceRedirectsOnDomain(domain, redirects)),
      }));
    },
  });

  return {
    reducer,
    listDomains,
    checkDomainHealth,
    ...actions,
  };
};
