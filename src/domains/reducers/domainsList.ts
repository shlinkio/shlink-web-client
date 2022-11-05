import { createSlice, createAction, SliceCaseReducers, AsyncThunk } from '@reduxjs/toolkit';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkDomainRedirects } from '../../api/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { Domain, DomainStatus } from '../data';
import { hasServerData } from '../../servers/data';
import { replaceAuthorityFromUri } from '../../utils/helpers/uri';
import { ProblemDetailsError } from '../../api/types/errors';
import { parseApiError } from '../../api/utils';
import { EditDomainRedirects } from './domainRedirects';

const LIST_DOMAINS = 'shlink/domainsList/LIST_DOMAINS';
const FILTER_DOMAINS = 'shlink/domainsList/FILTER_DOMAINS';
const VALIDATE_DOMAIN = 'shlink/domainsList/VALIDATE_DOMAIN';

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

const initialState: DomainsList = {
  domains: [],
  filteredDomains: [],
  loading: false,
  error: false,
};

export const replaceRedirectsOnDomain = ({ domain, redirects }: EditDomainRedirects) =>
  (d: Domain): Domain => (d.domain !== domain ? d : { ...d, redirects });

export const replaceStatusOnDomain = (domain: string, status: DomainStatus) =>
  (d: Domain): Domain => (d.domain !== domain ? d : { ...d, status });

export const domainsListReducerCreator = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
  editDomainRedirects: AsyncThunk<EditDomainRedirects, any, any>,
) => {
  const listDomains = createAsyncThunk(LIST_DOMAINS, async (_, { getState }): Promise<ListDomains> => {
    const { listDomains: shlinkListDomains } = buildShlinkApiClient(getState);
    const { data, defaultRedirects } = await shlinkListDomains();

    return {
      domains: data.map((domain): Domain => ({ ...domain, status: 'validating' })),
      defaultRedirects,
    };
  });

  const checkDomainHealth = createAsyncThunk(
    VALIDATE_DOMAIN,
    async (domain: string, { getState }): Promise<ValidateDomain> => {
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

  const filterDomains = createAction<string>(FILTER_DOMAINS);

  const { reducer } = createSlice<DomainsList, SliceCaseReducers<DomainsList>>({
    name: 'domainsList',
    initialState,
    reducers: {},
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

      builder.addCase(filterDomains, (state, { payload }) => ({
        ...state,
        filteredDomains: state.domains.filter(({ domain }) => domain.toLowerCase().match(payload.toLowerCase())),
      }));

      builder.addCase(editDomainRedirects.fulfilled, (state, { payload }) => ({
        ...state,
        domains: state.domains.map(replaceRedirectsOnDomain(payload)),
        filteredDomains: state.filteredDomains.map(replaceRedirectsOnDomain(payload)),
      }));
    },
  });

  return {
    reducer,
    listDomains,
    checkDomainHealth,
    filterDomains,
  };
};
