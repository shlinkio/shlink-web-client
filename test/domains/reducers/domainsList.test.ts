import { Mock } from 'ts-mockery';
import reducer, {
  LIST_DOMAINS,
  LIST_DOMAINS_ERROR,
  LIST_DOMAINS_START,
  ListDomainsAction,
  listDomains as listDomainsAction,
} from '../../../src/domains/reducers/domainsList';
import { ShlinkDomain } from '../../../src/utils/services/types';
import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';

describe('domainsList', () => {
  const domains = [ Mock.all<ShlinkDomain>(), Mock.all<ShlinkDomain>(), Mock.all<ShlinkDomain>() ];

  describe('reducer', () => {
    const action = (type: string, args: Partial<ListDomainsAction> = {}) => Mock.of<ListDomainsAction>(
      { type, ...args },
    );

    it('returns loading on LIST_DOMAINS_START', () => {
      expect(reducer(undefined, action(LIST_DOMAINS_START))).toEqual({ domains: [], loading: true, error: false });
    });

    it('returns error on LIST_DOMAINS_ERROR', () => {
      expect(reducer(undefined, action(LIST_DOMAINS_ERROR))).toEqual({ domains: [], loading: false, error: true });
    });

    it('returns domains on LIST_DOMAINS', () => {
      expect(reducer(undefined, action(LIST_DOMAINS, { domains }))).toEqual({ domains, loading: false, error: false });
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
      listDomains.mockResolvedValue(domains);

      await listDomainsAction(buildShlinkApiClient)()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_DOMAINS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_DOMAINS, domains });
      expect(listDomains).toHaveBeenCalledTimes(1);
    });
  });
});
