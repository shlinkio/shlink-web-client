import { Mock } from 'ts-mockery';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { EditDomainRedirects, editDomainRedirects } from '../../../src/domains/reducers/domainRedirects';
import { ShlinkDomainRedirects } from '../../../src/api/types';

describe('domainRedirectsReducer', () => {
  beforeEach(vi.clearAllMocks);

  describe('editDomainRedirects', () => {
    const domain = 'example.com';
    const redirects = Mock.all<ShlinkDomainRedirects>();
    const dispatch = vi.fn();
    const getState = vi.fn();
    const editDomainRedirectsCall = vi.fn();
    const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ editDomainRedirects: editDomainRedirectsCall });
    const editDomainRedirectsAction = editDomainRedirects(buildShlinkApiClient);

    it('dispatches error when loading domains fails', async () => {
      editDomainRedirectsCall.mockRejectedValue(new Error('error'));

      await editDomainRedirectsAction(Mock.of<EditDomainRedirects>({ domain }))(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        type: editDomainRedirectsAction.rejected.toString(),
      }));
      expect(editDomainRedirectsCall).toHaveBeenCalledTimes(1);
    });

    it('dispatches domain and redirects once loaded', async () => {
      editDomainRedirectsCall.mockResolvedValue(redirects);

      await editDomainRedirectsAction(Mock.of<EditDomainRedirects>({ domain }))(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        type: editDomainRedirectsAction.fulfilled.toString(),
        payload: { domain, redirects },
      }));
      expect(editDomainRedirectsCall).toHaveBeenCalledTimes(1);
    });
  });
});
