import { Mock } from 'ts-mockery';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import {
  EDIT_DOMAIN_REDIRECTS,
  EDIT_DOMAIN_REDIRECTS_ERROR,
  EDIT_DOMAIN_REDIRECTS_START,
  editDomainRedirects as editDomainRedirectsAction,
} from '../../../src/domains/reducers/domainRedirects';
import { ShlinkDomainRedirects } from '../../../src/api/types';

describe('domainRedirectsReducer', () => {
  beforeEach(jest.clearAllMocks);

  describe('editDomainRedirects', () => {
    const domain = 'example.com';
    const redirects = Mock.all<ShlinkDomainRedirects>();
    const dispatch = jest.fn();
    const getState = jest.fn();
    const editDomainRedirects = jest.fn();
    const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ editDomainRedirects });

    it('dispatches error when loading domains fails', async () => {
      editDomainRedirects.mockRejectedValue(new Error('error'));

      await editDomainRedirectsAction(buildShlinkApiClient)(domain, {})(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_DOMAIN_REDIRECTS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: EDIT_DOMAIN_REDIRECTS_ERROR });
      expect(editDomainRedirects).toHaveBeenCalledTimes(1);
    });

    it('dispatches domain and redirects once loaded', async () => {
      editDomainRedirects.mockResolvedValue(redirects);

      await editDomainRedirectsAction(buildShlinkApiClient)(domain, {})(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_DOMAIN_REDIRECTS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: EDIT_DOMAIN_REDIRECTS, domain, redirects });
      expect(editDomainRedirects).toHaveBeenCalledTimes(1);
    });
  });
});
