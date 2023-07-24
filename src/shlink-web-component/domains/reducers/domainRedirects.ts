import type { ShlinkApiClient } from '../../../api/services/ShlinkApiClient';
import type { ShlinkDomainRedirects } from '../../../api/types';
import { createAsyncThunk } from '../../../utils/helpers/redux';

const EDIT_DOMAIN_REDIRECTS = 'shlink/domainRedirects/EDIT_DOMAIN_REDIRECTS';

export interface EditDomainRedirects {
  domain: string;
  redirects: ShlinkDomainRedirects;
}

export const editDomainRedirects = (
  apiClient: ShlinkApiClient,
) => createAsyncThunk(
  EDIT_DOMAIN_REDIRECTS,
  async ({ domain, redirects: providedRedirects }: EditDomainRedirects): Promise<EditDomainRedirects> => {
    const redirects = await apiClient.editDomainRedirects({ domain, ...providedRedirects });
    return { domain, redirects };
  },
);
