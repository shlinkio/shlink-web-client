import type { AsyncThunk, SliceCaseReducers } from '@reduxjs/toolkit';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '../../../src/utils/helpers/redux';
import type { ProblemDetailsError, ShlinkApiClient, ShlinkDomainRedirects } from '../../api-contract';
import { parseApiError } from '../../api-contract/utils';
import type { Domain, DomainStatus } from '../data';
import type { EditDomainRedirects } from './domainRedirects';

const REDUCER_PREFIX = 'shlink/domainsList';

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
  apiClient: ShlinkApiClient,
  editDomainRedirects: AsyncThunk<EditDomainRedirects, any, any>,
) => {
  const listDomains = createAsyncThunk(`${REDUCER_PREFIX}/listDomains`, async (): Promise<ListDomains> => {
    const { data, defaultRedirects } = await apiClient.listDomains();

    return {
      domains: data.map((domain): Domain => ({ ...domain, status: 'validating' })),
      defaultRedirects,
    };
  });

  const checkDomainHealth = createAsyncThunk(
    `${REDUCER_PREFIX}/checkDomainHealth`,
    async (domain: string): Promise<ValidateDomain> => {
      try {
        const { status } = await apiClient.health(domain);
        return { domain, status: status === 'pass' ? 'valid' : 'invalid' };
      } catch (e) {
        return { domain, status: 'invalid' };
      }
    },
  );

  const filterDomains = createAction<string>(`${REDUCER_PREFIX}/filterDomains`);

  const { reducer } = createSlice<DomainsList, SliceCaseReducers<DomainsList>>({
    name: REDUCER_PREFIX,
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
