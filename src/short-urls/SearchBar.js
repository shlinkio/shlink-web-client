import tagsIcon from '@fortawesome/fontawesome-free-solid/faTags';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import Tag from '../utils/Tag';
import { listShortUrls } from './reducers/shortUrlsList';
import { isEmpty, pick } from 'ramda';
import SearchField from '../utils/SearchField';
import './SearchBar.scss';

export function SearchBar({ listShortUrls, shortUrlsListParams }) {
  const selectedTags = shortUrlsListParams.tags || [];

  return (
    <div className="serach-bar-container">
      <SearchField onChange={
        searchTerm => listShortUrls({ ...shortUrlsListParams, searchTerm })
      }/>

      {!isEmpty(selectedTags) && (
        <h4 className="search-bar__selected-tag mt-2">
          <FontAwesomeIcon icon={tagsIcon} className="search-bar__tags-icon"/>
          &nbsp;
          {selectedTags.map(tag => (
            <Tag
              key={tag}
              text={tag}
              clearable
              onClose={() => listShortUrls(
                {
                  ...shortUrlsListParams,
                  tags: selectedTags.filter(selectedTag => selectedTag !== tag)
                }
              )}
            />
          ))}
        </h4>
      )}
    </div>
  );
}

export default connect(pick(['shortUrlsListParams']), { listShortUrls })(SearchBar);
