import { Mock } from 'ts-mockery';
import {
  DomainsList,
  replaceRedirectsOnDomain,
  replaceStatusOnDomain,
  domainsListReducerCreator,
} from '../../../src/domains/reducers/domainsList';
import { editDomainRedirects } from '../../../src/domains/reducers/domainRedirects';
import { ShlinkDomainRedirects } from '../../../src/api/types';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { Domain } from '../../../src/domains/data';
import { ShlinkState } from '../../../src/container/types';
import { SelectedServer, ServerData } from '../../../src/servers/data';
import { parseApiError } from '../../../src/api/utils';

describe('domainsListReducer', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const listDomains = vi.fn();
  const health = vi.fn();
  const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ listDomains, health });
  const filteredDomains = [
    Mock.of<Domain>({ domain: 'foo', status: 'validating' }),
    Mock.of<Domain>({ domain: 'Boo', status: 'validating' }),
  ];
  const domains = [...filteredDomains, Mock.of<Domain>({ domain: 'bar', status: 'validating' })];
  const error = { type: 'NOT_FOUND', status: 404 };
  const editDomainRedirectsThunk = editDomainRedirects(buildShlinkApiClient);
  const { reducer, listDomains: listDomainsAction, checkDomainHealth, filterDomains } = domainsListReducerCreator(
    buildShlinkApiClient,
    editDomainRedirectsThunk,
  );

  beforeEach(vi.clearAllMocks);

  describe('reducer', () => {
    it('returns loading on LIST_DOMAINS_START', () => {
      expect(reducer(undefined, { type: listDomainsAction.pending.toString() })).toEqual(
        { domains: [], filteredDomains: [], loading: true, error: false },
      );
    });

    it('returns error on LIST_DOMAINS_ERROR', () => {
      expect(reducer(undefined, { type: listDomainsAction.rejected.toString(), error })).toEqual(
        { domains: [], filteredDomains: [], loading: false, error: true, errorData: parseApiError(error) },
      );
    });

    it('returns domains on LIST_DOMAINS', () => {
      expect(
        reducer(undefined, { type: listDomainsAction.fulfilled.toString(), payload: { domains } }),
      ).toEqual({ domains, filteredDomains: domains, loading: false, error: false });
    });

    it('filters domains on FILTER_DOMAINS', () => {
      expect(
        reducer(Mock.of<DomainsList>({ domains }), { type: filterDomains.toString(), payload: 'oO' }),
      ).toEqual({ domains, filteredDomains });
    });

    it.each([
      ['foo'],
      ['bar'],
      ['does_not_exist'],
    ])('replaces redirects on proper domain on EDIT_DOMAIN_REDIRECTS', (domain) => {
      const redirects: ShlinkDomainRedirects = {
        baseUrlRedirect: 'bar',
        regular404Redirect: 'foo',
        invalidShortUrlRedirect: null,
      };

      expect(reducer(Mock.of<DomainsList>({ domains, filteredDomains }), {
        type: editDomainRedirectsThunk.fulfilled.toString(),
        payload: { domain, redirects },
      })).toEqual({
        domains: domains.map(replaceRedirectsOnDomain({ domain, redirects })),
        filteredDomains: filteredDomains.map(replaceRedirectsOnDomain({ domain, redirects })),
      });
    });

    it.each([
      ['foo'],
      ['bar'],
      ['does_not_exist'],
    ])('replaces status on proper domain on VALIDATE_DOMAIN', (domain) => {
      expect(reducer(
        Mock.of<DomainsList>({ domains, filteredDomains }),
        {
          type: checkDomainHealth.fulfilled.toString(),
          payload: { domain, status: 'valid' },
        },
      )).toEqual({
        domains: domains.map(replaceStatusOnDomain(domain, 'valid')),
        filteredDomains: filteredDomains.map(replaceStatusOnDomain(domain, 'valid')),
      });
    });
  });

  describe('listDomains', () => {
    it('dispatches error when loading domains fails', async () => {
      listDomains.mockRejectedValue(new Error('error'));

      await listDomainsAction()(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: listDomainsAction.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: listDomainsAction.rejected.toString(),
      }));
      expect(listDomains).toHaveBeenCalledTimes(1);
    });

    it('dispatches domains once loaded', async () => {
      listDomains.mockResolvedValue({ data: domains });

      await listDomainsAction()(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: listDomainsAction.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: listDomainsAction.fulfilled.toString(),
        payload: { domains },
      }));
      expect(listDomains).toHaveBeenCalledTimes(1);
    });
  });

  describe('filterDomains', () => {
    it.each([
      ['foo'],
      ['bar'],
      ['something'],
    ])('creates action as expected', (searchTerm) => {
      expect(filterDomains(searchTerm)).toEqual(
        expect.objectContaining({ type: filterDomains.toString(), payload: searchTerm }),
      );
    });
  });

  describe('checkDomainHealth', () => {
    const domain = 'example.com';

    it('dispatches invalid status when selected server does not have all required data', async () => {
      getState.mockReturnValue(Mock.of<ShlinkState>({
        selectedServer: Mock.all<SelectedServer>(),
      }));

      await checkDomainHealth(domain)(dispatch, getState, {});

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        type: checkDomainHealth.fulfilled.toString(),
        payload: { domain, status: 'invalid' },
      }));
    });

    it('dispatches invalid status when health endpoint returns an error', async () => {
      getState.mockReturnValue(Mock.of<ShlinkState>({
        selectedServer: Mock.of<ServerData>({
          url: 'https://myerver.com',
          apiKey: '123',
        }),
      }));
      health.mockRejectedValue({});

      await checkDomainHealth(domain)(dispatch, getState, {});

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        type: checkDomainHealth.fulfilled.toString(),
        payload: { domain, status: 'invalid' },
      }));
    });

    it.each([
      ['pass', 'valid'],
      ['fail', 'invalid'],
    ])('dispatches proper status based on status returned from health endpoint', async (
      healthStatus,
      expectedStatus,
    ) => {
      getState.mockReturnValue(Mock.of<ShlinkState>({
        selectedServer: Mock.of<ServerData>({
          url: 'https://myerver.com',
          apiKey: '123',
        }),
      }));
      health.mockResolvedValue({ status: healthStatus });

      await checkDomainHealth(domain)(dispatch, getState, {});

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        type: checkDomainHealth.fulfilled.toString(),
        payload: { domain, status: expectedStatus },
      }));
    });
  });
});
