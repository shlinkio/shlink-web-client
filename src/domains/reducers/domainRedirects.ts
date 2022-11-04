import { createAsyncThunk } from '@reduxjs/toolkit';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ShlinkDomainRedirects } from '../../api/types';
import { ShlinkState } from '../../container/types';

const EDIT_DOMAIN_REDIRECTS = 'shlink/domainRedirects/EDIT_DOMAIN_REDIRECTS';

export interface EditDomainRedirects {
  domain: string;
  redirects: ShlinkDomainRedirects;
}

export const editDomainRedirects = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
) => createAsyncThunk<EditDomainRedirects, EditDomainRedirects, { state: ShlinkState }>(
  EDIT_DOMAIN_REDIRECTS,
  async ({ domain, redirects: domainRedirects }, { getState }) => {
    const { editDomainRedirects: shlinkEditDomainRedirects } = buildShlinkApiClient(getState);
    const redirects = await shlinkEditDomainRedirects({ domain, ...domainRedirects });

    return { domain, redirects };
  },
);
