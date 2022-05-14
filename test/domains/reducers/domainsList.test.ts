import { Mock } from 'ts-mockery';
import reducer, {
  LIST_DOMAINS,
  LIST_DOMAINS_ERROR,
  LIST_DOMAINS_START,
  FILTER_DOMAINS,
  VALIDATE_DOMAIN,
  DomainsCombinedAction,
  DomainsList,
  listDomains as listDomainsAction,
  filterDomains as filterDomainsAction,
  replaceRedirectsOnDomain,
  checkDomainHealth,
  replaceStatusOnDomain,
} from '../../../src/domains/reducers/domainsList';
import { EDIT_DOMAIN_REDIRECTS } from '../../../src/domains/reducers/domainRedirects';
import { ShlinkDomainRedirects } from '../../../src/api/types';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';
import { Domain } from '../../../src/domains/data';
import { ShlinkState } from '../../../src/container/types';
import { SelectedServer, ServerData } from '../../../src/servers/data';

describe('domainsListReducer', () => {
  const dispatch = jest.fn();
  const getState = jest.fn();
  const listDomains = jest.fn();
  const health = jest.fn();
  const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ listDomains, health });
  const filteredDomains = [
    Mock.of<Domain>({ domain: 'foo', status: 'validating' }),
    Mock.of<Domain>({ domain: 'boo', status: 'validating' }),
  ];
  const domains = [...filteredDomains, Mock.of<Domain>({ domain: 'bar', status: 'validating' })];

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    const action = (type: string, args: Partial<DomainsCombinedAction> = {}) => Mock.of<DomainsCombinedAction>(
      { type, ...args },
    );

    it('returns loading on LIST_DOMAINS_START', () => {
      expect(reducer(undefined, action(LIST_DOMAINS_START))).toEqual(
        { domains: [], filteredDomains: [], loading: true, error: false },
      );
    });

    it('returns error on LIST_DOMAINS_ERROR', () => {
      expect(reducer(undefined, action(LIST_DOMAINS_ERROR))).toEqual(
        { domains: [], filteredDomains: [], loading: false, error: true },
      );
    });

    it('returns domains on LIST_DOMAINS', () => {
      expect(reducer(undefined, action(LIST_DOMAINS, { domains }))).toEqual(
        { domains, filteredDomains: domains, loading: false, error: false },
      );
    });

    it('filters domains on FILTER_DOMAINS', () => {
      expect(reducer(Mock.of<DomainsList>({ domains }), action(FILTER_DOMAINS, { searchTerm: 'oo' }))).toEqual(
        { domains, filteredDomains },
      );
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

      expect(reducer(
        Mock.of<DomainsList>({ domains, filteredDomains }),
        action(EDIT_DOMAIN_REDIRECTS, { domain, redirects }),
      )).toEqual({
        domains: domains.map(replaceRedirectsOnDomain(domain, redirects)),
        filteredDomains: filteredDomains.map(replaceRedirectsOnDomain(domain, redirects)),
      });
    });

    it.each([
      ['foo'],
      ['bar'],
      ['does_not_exist'],
    ])('replaces status on proper domain on VALIDATE_DOMAIN', (domain) => {
      expect(reducer(
        Mock.of<DomainsList>({ domains, filteredDomains }),
        action(VALIDATE_DOMAIN, { domain, status: 'valid' }),
      )).toEqual({
        domains: domains.map(replaceStatusOnDomain(domain, 'valid')),
        filteredDomains: filteredDomains.map(replaceStatusOnDomain(domain, 'valid')),
      });
    });
  });

  describe('listDomains', () => {
    it('dispatches error when loading domains fails', async () => {
      listDomains.mockRejectedValue(new Error('error'));

      await listDomainsAction(buildShlinkApiClient)()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_DOMAINS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_DOMAINS_ERROR });
      expect(listDomains).toHaveBeenCalledTimes(1);
    });

    it('dispatches domains once loaded', async () => {
      listDomains.mockResolvedValue({ data: domains });

      await listDomainsAction(buildShlinkApiClient)()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_DOMAINS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_DOMAINS, domains, defaultRedirects: undefined });
      expect(listDomains).toHaveBeenCalledTimes(1);
    });
  });

  describe('filterDomains', () => {
    it.each([
      ['foo'],
      ['bar'],
      ['something'],
    ])('creates action as expected', (searchTerm) => {
      expect(filterDomainsAction(searchTerm)).toEqual({ type: FILTER_DOMAINS, searchTerm });
    });
  });

  describe('checkDomainHealth', () => {
    const domain = 'example.com';

    it('dispatches invalid status when selected server does not have all required data', async () => {
      getState.mockReturnValue(Mock.of<ShlinkState>({
        selectedServer: Mock.all<SelectedServer>(),
      }));

      await checkDomainHealth(buildShlinkApiClient)(domain)(dispatch, getState);

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: VALIDATE_DOMAIN, domain, status: 'invalid' });
    });

    it('dispatches invalid status when health endpoint returns an error', async () => {
      getState.mockReturnValue(Mock.of<ShlinkState>({
        selectedServer: Mock.of<ServerData>({
          url: 'https://myerver.com',
          apiKey: '123',
        }),
      }));
      health.mockRejectedValue({});

      await checkDomainHealth(buildShlinkApiClient)(domain)(dispatch, getState);

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: VALIDATE_DOMAIN, domain, status: 'invalid' });
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

      await checkDomainHealth(buildShlinkApiClient)(domain)(dispatch, getState);

      expect(getState).toHaveBeenCalledTimes(1);
      expect(health).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: VALIDATE_DOMAIN, domain, status: expectedStatus });
    });
  });
});
