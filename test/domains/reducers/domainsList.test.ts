import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import type { ShlinkDomainRedirects } from '../../../src/api/types';
import { parseApiError } from '../../../src/api/utils';
import type { ShlinkState } from '../../../src/container/types';
import type { Domain } from '../../../src/domains/data';
import type { EditDomainRedirects } from '../../../src/domains/reducers/domainRedirects';
import { editDomainRedirects } from '../../../src/domains/reducers/domainRedirects';
import {
  domainsListReducerCreator,
  replaceRedirectsOnDomain,
  replaceStatusOnDomain,
} from '../../../src/domains/reducers/domainsList';

describe('domainsListReducer', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const listDomains = vi.fn();
  const health = vi.fn();
  const buildShlinkApiClient = () => fromPartial<ShlinkApiClient>({ listDomains, health });
  const filteredDomains: Domain[] = [
    fromPartial({ domain: 'foo', status: 'validating' }),
    fromPartial({ domain: 'Boo', status: 'validating' }),
  ];
  const domains: Domain[] = [...filteredDomains, fromPartial({ domain: 'bar', status: 'validating' })];
  const error = { type: 'NOT_FOUND', status: 404 } as unknown as Error;
  const editDomainRedirectsThunk = editDomainRedirects(buildShlinkApiClient);
  const { reducer, listDomains: listDomainsAction, checkDomainHealth, filterDomains } = domainsListReducerCreator(
    buildShlinkApiClient,
    editDomainRedirectsThunk,
  );

  describe('reducer', () => {
    it('returns loading on LIST_DOMAINS_START', () => {
      expect(reducer(undefined, listDomainsAction.pending(''))).toEqual(
        { domains: [], filteredDomains: [], loading: true, error: false },
      );
    });

    it('returns error on LIST_DOMAINS_ERROR', () => {
      expect(reducer(undefined, listDomainsAction.rejected(error, ''))).toEqual(
        { domains: [], filteredDomains: [], loading: false, error: true, errorData: parseApiError(error) },
      );
    });

    it('returns domains on LIST_DOMAINS', () => {
      expect(
        reducer(undefined, listDomainsAction.fulfilled({ domains }, '')),
      ).toEqual({ domains, filteredDomains: domains, loading: false, error: false });
    });

    it('filters domains on FILTER_DOMAINS', () => {
      expect(reducer(fromPartial({ domains }), filterDomains('oO'))).toEqual({ domains, filteredDomains });
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
      const editDomainRedirects: EditDomainRedirects = { domain, redirects };

      expect(reducer(
        fromPartial({ domains, filteredDomains }),
        editDomainRedirectsThunk.fulfilled(editDomainRedirects, '', editDomainRedirects),
      )).toEqual({
        domains: domains.map(replaceRedirectsOnDomain(editDomainRedirects)),
        filteredDomains: filteredDomains.map(replaceRedirectsOnDomain(editDomainRedirects)),
      });
    });

    it.each([
      ['foo'],
      ['bar'],
      ['does_not_exist'],
    ])('replaces status on proper domain on VALIDATE_DOMAIN', (domain) => {
      expect(reducer(
        fromPartial({ domains, filteredDomains }),
        checkDomainHealth.fulfilled({ domain, status: 'valid' }, '', ''),
      )).toEqual({
        domains: domains.map(replaceStatusOnDomain(domain, 'valid')),
        filteredDomains: filteredDomains.map(replaceStatusOnDomain(domain, 'valid')),
      });
    });
  });

  describe('listDomains', () => {
    it('dispatches domains once loaded', async () => {
      listDomains.mockResolvedValue({ data: domains });

      await listDomainsAction()(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
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
      expect(filterDomains(searchTerm).payload).toEqual(searchTerm);
    });
  });

  describe('checkDomainHealth', () => {
    const domain = 'example.com';

    it('dispatches invalid status when selected server does not have all required data', async () => {
      getState.mockReturnValue(fromPartial<ShlinkState>({
        selectedServer: {},
      }));

      await checkDomainHealth(domain)(dispatch, getState, {});

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        payload: { domain, status: 'invalid' },
      }));
    });

    it('dispatches invalid status when health endpoint returns an error', async () => {
      getState.mockReturnValue(fromPartial<ShlinkState>({
        selectedServer: {
          url: 'https://myerver.com',
          apiKey: '123',
        },
      }));
      health.mockRejectedValue({});

      await checkDomainHealth(domain)(dispatch, getState, {});

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
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
      getState.mockReturnValue(fromPartial<ShlinkState>({
        selectedServer: {
          url: 'https://myerver.com',
          apiKey: '123',
        },
      }));
      health.mockResolvedValue({ status: healthStatus });

      await checkDomainHealth(domain)(dispatch, getState, {});

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        payload: { domain, status: expectedStatus },
      }));
    });
  });
});
