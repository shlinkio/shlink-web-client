import { handleActions } from 'redux-actions';
import PropTypes from 'prop-types';

/* eslint-disable padding-line-between-statements */
export const DELETE_TAG_START = 'shlink/deleteTag/DELETE_TAG_START';
export const DELETE_TAG_ERROR = 'shlink/deleteTag/DELETE_TAG_ERROR';
export const DELETE_TAG = 'shlink/deleteTag/DELETE_TAG';
export const TAG_DELETED = 'shlink/deleteTag/TAG_DELETED';
/* eslint-enable padding-line-between-statements */

export const tagDeleteType = PropTypes.shape({
  deleting: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  deleting: false,
  error: false,
};

export default handleActions({
  [DELETE_TAG_START]: () => ({ deleting: true, error: false }),
  [DELETE_TAG_ERROR]: () => ({ deleting: false, error: true }),
  [DELETE_TAG]: () => ({ deleting: false, error: false }),
}, initialState);

export const deleteTag = (buildShlinkApiClient) => (tag) => async (dispatch, getState) => {
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

export const tagDeleted = (tag) => ({ type: TAG_DELETED, tag });
