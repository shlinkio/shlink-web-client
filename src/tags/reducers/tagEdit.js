import { curry, pick } from 'ramda';
import shlinkApiClient from '../../api/ShlinkApiClient';
import colorGenerator from '../../utils/ColorGenerator';

/* eslint-disable padding-line-between-statements, newline-after-var */
const EDIT_TAG_START = 'shlink/editTag/EDIT_TAG_START';
const EDIT_TAG_ERROR = 'shlink/editTag/EDIT_TAG_ERROR';
const EDIT_TAG = 'shlink/editTag/EDIT_TAG';
/* eslint-enable padding-line-between-statements, newline-after-var */

export const TAG_EDITED = 'shlink/editTag/TAG_EDITED';

const defaultState = {
  oldName: '',
  newName: '',
  editing: false,
  error: false,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case EDIT_TAG_START:
      return {
        ...state,
        editing: true,
        error: false,
      };
    case EDIT_TAG_ERROR:
      return {
        ...state,
        editing: false,
        error: true,
      };
    case EDIT_TAG:
      return {
        ...pick([ 'oldName', 'newName' ], action),
        editing: false,
        error: false,
      };
    default:
      return state;
  }
}

export const _editTag = (shlinkApiClient, colorGenerator, oldName, newName, color) =>
  async (dispatch) => {
    dispatch({ type: EDIT_TAG_START });

    try {
      await shlinkApiClient.editTag(oldName, newName);
      colorGenerator.setColorForKey(newName, color);
      dispatch({ type: EDIT_TAG, oldName, newName });
    } catch (e) {
      dispatch({ type: EDIT_TAG_ERROR });

      throw e;
    }
  };

export const editTag = curry(_editTag)(shlinkApiClient, colorGenerator);

export const tagEdited = (oldName, newName, color) => ({
  type: TAG_EDITED,
  oldName,
  newName,
  color,
});
