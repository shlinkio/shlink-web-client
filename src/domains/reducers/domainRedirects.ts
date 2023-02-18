import type { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import type { ShlinkDomainRedirects } from '../../api/types';
import { createAsyncThunk } from '../../utils/helpers/redux';

const EDIT_DOMAIN_REDIRECTS = 'shlink/domainRedirects/EDIT_DOMAIN_REDIRECTS';

export interface EditDomainRedirects {
  domain: string;
  redirects: ShlinkDomainRedirects;
}

export const editDomainRedirects = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
) => createAsyncThunk(
  EDIT_DOMAIN_REDIRECTS,
  async ({ domain, redirects: providedRedirects }: EditDomainRedirects, { getState }): Promise<EditDomainRedirects> => {
    const { editDomainRedirects: shlinkEditDomainRedirects } = buildShlinkApiClient(getState);
    const redirects = await shlinkEditDomainRedirects({ domain, ...providedRedirects });

    return { domain, redirects };
  },
);
