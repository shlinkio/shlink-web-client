import { Action, Dispatch } from 'redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ShlinkDomainRedirects } from '../../api/types';
import { GetState } from '../../container/types';
import { ApiErrorAction } from '../../api/types/actions';
import { parseApiError } from '../../api/utils';

/* eslint-disable padding-line-between-statements */
export const EDIT_DOMAIN_REDIRECTS_START = 'shlink/domainRedirects/EDIT_DOMAIN_REDIRECTS_START';
export const EDIT_DOMAIN_REDIRECTS_ERROR = 'shlink/domainRedirects/EDIT_DOMAIN_REDIRECTS_ERROR';
export const EDIT_DOMAIN_REDIRECTS = 'shlink/domainRedirects/EDIT_DOMAIN_REDIRECTS';
/* eslint-enable padding-line-between-statements */

export interface EditDomainRedirectsAction extends Action<string> {
  domain: string;
  redirects: ShlinkDomainRedirects;
}

export const editDomainRedirects = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  domain: string,
  domainRedirects: Partial<ShlinkDomainRedirects>,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: EDIT_DOMAIN_REDIRECTS_START });
  const { editDomainRedirects } = buildShlinkApiClient(getState);

  try {
    const redirects = await editDomainRedirects({ domain, ...domainRedirects });

    dispatch<EditDomainRedirectsAction>({ type: EDIT_DOMAIN_REDIRECTS, domain, redirects });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: EDIT_DOMAIN_REDIRECTS_ERROR, errorData: parseApiError(e) });
  }
};
