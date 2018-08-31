import { isEmpty, reject } from 'ramda';
import shlinkApiClient from '../../api/ShlinkApiClient';
import { TAG_DELETED } from './tagDelete';
import { TAG_EDITED } from './tagEdit';

/* eslint-disable padding-line-between-statements, newline-after-var */
const LIST_TAGS_START = 'shlink/tagsList/LIST_TAGS_START';
const LIST_TAGS_ERROR = 'shlink/tagsList/LIST_TAGS_ERROR';
const LIST_TAGS = 'shlink/tagsList/LIST_TAGS';
const FILTER_TAGS = 'shlink/tagsList/FILTER_TAGS';
/* eslint-enable padding-line-between-statements, newline-after-var */

const defaultState = {
  tags: [],
  filteredTags: [],
  loading: false,
  error: false,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case LIST_TAGS_START:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case LIST_TAGS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case LIST_TAGS:
      return {
        tags: action.tags,
        filteredTags: action.tags,
        loading: false,
        error: false,
      };
    case TAG_DELETED:
      return {
        ...state,

        // FIXME This should be optimized somehow...
        tags: reject((tag) => tag === action.tag, state.tags),
        filteredTags: reject((tag) => tag === action.tag, state.filteredTags),
      };
    case TAG_EDITED:
      const renameTag = (tag) => tag === action.oldName ? action.newName : tag;

      return {
        ...state,

        // FIXME This should be optimized somehow...
        tags: state.tags.map(renameTag).sort(),
        filteredTags: state.filteredTags.map(renameTag).sort(),
      };
    case FILTER_TAGS:
      return {
        ...state,
        filteredTags: state.tags.filter((tag) => tag.toLowerCase().match(action.searchTerm)),
      };
    default:
      return state;
  }
}

export const _listTags = (shlinkApiClient, force = false) => async (dispatch, getState) => {
  const { tagsList } = getState();

  if (!force && (tagsList.loading || !isEmpty(tagsList.tags))) {
    return;
  }

  dispatch({ type: LIST_TAGS_START });

  try {
    const tags = await shlinkApiClient.listTags();

    dispatch({ tags, type: LIST_TAGS });
  } catch (e) {
    dispatch({ type: LIST_TAGS_ERROR });
  }
};

export const listTags = () => _listTags(shlinkApiClient);

export const forceListTags = () => _listTags(shlinkApiClient, true);

export const filterTags = (searchTerm) => ({
  type: FILTER_TAGS,
  searchTerm,
});
