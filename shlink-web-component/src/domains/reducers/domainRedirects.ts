import type { ShlinkApiClient, ShlinkDomainRedirects } from '../../api-contract';
import { createAsyncThunk } from '../../utils/redux';

const EDIT_DOMAIN_REDIRECTS = 'shlink/domainRedirects/EDIT_DOMAIN_REDIRECTS';

export interface EditDomainRedirects {
  domain: string;
  redirects: ShlinkDomainRedirects;
}

export const editDomainRedirects = (
  apiClientFactory: () => ShlinkApiClient,
) => createAsyncThunk(
  EDIT_DOMAIN_REDIRECTS,
  async ({ domain, redirects: providedRedirects }: EditDomainRedirects): Promise<EditDomainRedirects> => {
    const apiClient = apiClientFactory();
    const redirects = await apiClient.editDomainRedirects({ domain, ...providedRedirects });
    return { domain, redirects };
  },
);
