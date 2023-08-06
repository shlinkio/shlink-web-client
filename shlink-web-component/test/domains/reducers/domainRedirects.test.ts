import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkApiClient, ShlinkDomainRedirects } from '../../../src/api-contract';
import { editDomainRedirects } from '../../../src/domains/reducers/domainRedirects';

describe('domainRedirectsReducer', () => {
  describe('editDomainRedirects', () => {
    const domain = 'example.com';
    const redirects = fromPartial<ShlinkDomainRedirects>({});
    const dispatch = vi.fn();
    const getState = vi.fn();
    const editDomainRedirectsCall = vi.fn();
    const buildShlinkApiClient = () => fromPartial<ShlinkApiClient>({ editDomainRedirects: editDomainRedirectsCall });
    const editDomainRedirectsAction = editDomainRedirects(buildShlinkApiClient);

    it('dispatches domain and redirects once loaded', async () => {
      editDomainRedirectsCall.mockResolvedValue(redirects);

      await editDomainRedirectsAction(fromPartial({ domain }))(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        payload: { domain, redirects },
      }));
      expect(editDomainRedirectsCall).toHaveBeenCalledTimes(1);
    });
  });
});
