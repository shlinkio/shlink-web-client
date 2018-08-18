import ShlinkApiClient from '../../api/ShlinkApiClient';
import { curry } from 'ramda';
import PropTypes from 'prop-types';

const DELETE_TAG_START = 'shlink/deleteTag/DELETE_TAG_START';
const DELETE_TAG_ERROR = 'shlink/deleteTag/DELETE_TAG_ERROR';
const DELETE_TAG = 'shlink/deleteTag/DELETE_TAG';

export const tagDeleteType = PropTypes.shape({
  deleting: PropTypes.bool,
  error: PropTypes.bool,
});

const defaultState = {
  deleting: false,
  error: false,
};

export default function reduce(state = defaultState, action) {
  switch (action.type) {
    case DELETE_TAG_START:
      return {
        deleting: true,
        error: false,
      };
    case DELETE_TAG_ERROR:
      return {
        deleting: false,
        error: true,
      };
    case DELETE_TAG:
      return {
        deleting: false,
        error: false,
      };
    default:
      return state;
  }
}

export const _deleteTag = (ShlinkApiClient, tag) => async dispatch => {
  dispatch({ type: DELETE_TAG_START });

  try {
    await ShlinkApiClient.deleteTags([tag]);
    dispatch({ type: DELETE_TAG });
  } catch (e) {
    dispatch({ type: DELETE_TAG_ERROR });
    throw e;
  }
};
export const deleteTag = curry(_deleteTag)(ShlinkApiClient);
