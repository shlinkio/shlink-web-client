import ShlinkApiClient from '../../api/ShlinkApiClient';
import ColorGenerator from '../../utils/ColorGenerator';
import { curry } from 'ramda';

const EDIT_TAG_START = 'shlink/editTag/EDIT_TAG_START';
const EDIT_TAG_ERROR = 'shlink/editTag/EDIT_TAG_ERROR';
const EDIT_TAG = 'shlink/editTag/EDIT_TAG';
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
        oldName: action.oldName,
        newName: action.newName,
        editing: false,
        error: false,
      };
    default:
      return state;
  }
}

export const _editTag = (ShlinkApiClient, ColorGenerator, oldName, newName) => async dispatch => {
  dispatch({ type: EDIT_TAG_START });

  try {
    await ShlinkApiClient.editTag(oldName, newName);

    // Make new tag name use the same color as the old one
    const color = ColorGenerator.getColorForKey(oldName);
    ColorGenerator.setColorForKey(newName, color);

    dispatch({ type: EDIT_TAG, oldName, newName });
  } catch (e) {
    dispatch({ type: EDIT_TAG_ERROR });
    throw e;
  }
};
export const editTag = curry(_editTag)(ShlinkApiClient, ColorGenerator);

export const tagEdited = (oldName, newName) => ({
  type: TAG_EDITED,
  oldName,
  newName,
});
