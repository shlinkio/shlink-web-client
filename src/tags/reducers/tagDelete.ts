import PropTypes from 'prop-types';
import { Action, Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';

/* eslint-disable padding-line-between-statements */
export const DELETE_TAG_START = 'shlink/deleteTag/DELETE_TAG_START';
export const DELETE_TAG_ERROR = 'shlink/deleteTag/DELETE_TAG_ERROR';
export const DELETE_TAG = 'shlink/deleteTag/DELETE_TAG';
export const TAG_DELETED = 'shlink/deleteTag/TAG_DELETED';
/* eslint-enable padding-line-between-statements */

/** @deprecated Use TagDeletion interface */
export const tagDeleteType = PropTypes.shape({
  deleting: PropTypes.bool,
  error: PropTypes.bool,
});

export interface TagDeletion {
  deleting: boolean;
  error: boolean;
}

export interface DeleteTagAction extends Action<string> {
  tag: string;
}

const initialState: TagDeletion = {
  deleting: false,
  error: false,
};

export default buildReducer({
  [DELETE_TAG_START]: () => ({ deleting: true, error: false }),
  [DELETE_TAG_ERROR]: () => ({ deleting: false, error: true }),
  [DELETE_TAG]: () => ({ deleting: false, error: false }),
}, initialState);

export const deleteTag = (buildShlinkApiClient: ShlinkApiClientBuilder) => (tag: string) => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch({ type: DELETE_TAG_START });
  const { deleteTags } = buildShlinkApiClient(getState);

  try {
    await deleteTags([ tag ]);
    dispatch({ type: DELETE_TAG });
  } catch (e) {
    dispatch({ type: DELETE_TAG_ERROR });

    throw e;
  }
};

export const tagDeleted = (tag: string): DeleteTagAction => ({ type: TAG_DELETED, tag });
