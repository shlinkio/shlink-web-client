import { Action, Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { OptionalString } from '../../utils/utils';
import { EditShortUrlData, ShortUrl } from '../data';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ProblemDetailsError } from '../../api/types';
import { parseApiError } from '../../api/utils';
import { supportsTagsInPatch } from '../../utils/helpers/features';
import { ApiErrorAction } from '../../api/types/actions';

export const EDIT_SHORT_URL_START = 'shlink/shortUrlEdition/EDIT_SHORT_URL_START';
export const EDIT_SHORT_URL_ERROR = 'shlink/shortUrlEdition/EDIT_SHORT_URL_ERROR';
export const SHORT_URL_EDITED = 'shlink/shortUrlEdition/SHORT_URL_EDITED';

export interface ShortUrlEdition {
  shortUrl?: ShortUrl;
  saving: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface ShortUrlEditedAction extends Action<string> {
  shortUrl: ShortUrl;
}

const initialState: ShortUrlEdition = {
  saving: false,
  error: false,
};

export default buildReducer<ShortUrlEdition, ShortUrlEditedAction & ApiErrorAction>({
  [EDIT_SHORT_URL_START]: (state) => ({ ...state, saving: true, error: false }),
  [EDIT_SHORT_URL_ERROR]: (state, { errorData }) => ({ ...state, saving: false, error: true, errorData }),
  [SHORT_URL_EDITED]: (_, { shortUrl }) => ({ shortUrl, saving: false, error: false }),
}, initialState);

export const editShortUrl = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  domain: OptionalString,
  data: EditShortUrlData,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: EDIT_SHORT_URL_START });

  const { selectedServer } = getState();
  const sendTagsSeparately = !supportsTagsInPatch(selectedServer);
  const { updateShortUrl, updateShortUrlTags } = buildShlinkApiClient(getState);

  try {
    const [shortUrl] = await Promise.all([
      updateShortUrl(shortCode, domain, data as any), // FIXME Parse dates
      sendTagsSeparately && data.tags ? updateShortUrlTags(shortCode, domain, data.tags) : undefined,
    ]);

    dispatch<ShortUrlEditedAction>({ shortUrl, type: SHORT_URL_EDITED });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: EDIT_SHORT_URL_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};
