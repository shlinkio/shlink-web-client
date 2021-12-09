import { Mock } from 'ts-mockery';
import reducer, {
  LIST_DOMAINS,
  LIST_DOMAINS_ERROR,
  LIST_DOMAINS_START,
  FILTER_DOMAINS,
  DomainsCombinedAction,
  DomainsList,
  listDomains as listDomainsAction,
  filterDomains as filterDomainsAction,
  replaceRedirectsOnDomain,
} from '../../../src/domains/reducers/domainsList';
import { EDIT_DOMAIN_REDIRECTS } from '../../../src/domains/reducers/domainRedirects';
import { ShlinkDomain, ShlinkDomainRedirects } from '../../../src/api/types';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';

describe('domainsListReducer', () => {
  const filteredDomains = [ Mock.of<ShlinkDomain>({ domain: 'foo' }), Mock.of<ShlinkDomain>({ domain: 'boo' }) ];
  const domains = [ ...filteredDomains, Mock.of<ShlinkDomain>({ domain: 'bar' }) ];

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
      [ 'foo' ],
      [ 'bar' ],
      [ 'does_not_exist' ],
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
  });

  describe('listDomains', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const listDomains = jest.fn();
    const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ listDomains });

    beforeEach(jest.clearAllMocks);

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
      [ 'foo' ],
      [ 'bar' ],
      [ 'something' ],
    ])('creates action as expected', (searchTerm) => {
      expect(filterDomainsAction(searchTerm)).toEqual({ type: FILTER_DOMAINS, searchTerm });
    });
  });
});
