import tagsIcon from '@fortawesome/fontawesome-free-solid/faTags';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, pick } from 'ramda';
import PropTypes from 'prop-types';
import Tag from '../utils/Tag';
import SearchField from '../utils/SearchField';
import { listShortUrls } from './reducers/shortUrlsList';
import './SearchBar.scss';
import { shortUrlsListParamsType } from './reducers/shortUrlsListParams';

const propTypes = {
  listShortUrls: PropTypes.func,
  shortUrlsListParams: shortUrlsListParamsType,
};

export function SearchBarComponent({ listShortUrls, shortUrlsListParams }) {
  const selectedTags = shortUrlsListParams.tags || [];

  return (
    <div className="serach-bar-container">
      <SearchField onChange={
        (searchTerm) => listShortUrls({ ...shortUrlsListParams, searchTerm })
      }
      />

      {!isEmpty(selectedTags) && (
        <h4 className="search-bar__selected-tag mt-2">
          <FontAwesomeIcon icon={tagsIcon} className="search-bar__tags-icon" />
          &nbsp;
          {selectedTags.map((tag) => (
            <Tag
              key={tag}
              text={tag}
              clearable
              onClose={() => listShortUrls(
                {
                  ...shortUrlsListParams,
                  tags: selectedTags.filter((selectedTag) => selectedTag !== tag),
                }
              )}
            />
          ))}
        </h4>
      )}
    </div>
  );
}

SearchBarComponent.propTypes = propTypes;

const SearchBar = connect(pick([ 'shortUrlsListParams' ]), { listShortUrls })(SearchBarComponent);

export default SearchBar;
