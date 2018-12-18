import tagsIcon from '@fortawesome/fontawesome-free-solid/faTags';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { isEmpty } from 'ramda';
import PropTypes from 'prop-types';
import SearchField from '../utils/SearchField';
import Tag from '../tags/helpers/Tag';
import { shortUrlsListParamsType } from './reducers/shortUrlsListParams';
import './SearchBar.scss';

const propTypes = {
  listShortUrls: PropTypes.func,
  shortUrlsListParams: shortUrlsListParamsType,
};

const SearchBar = (colorGenerator) => {
  const SearchBar = ({ listShortUrls, shortUrlsListParams }) => {
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
                colorGenerator={colorGenerator}
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
  };

  SearchBar.propTypes = propTypes;

  return SearchBar;
};

export default SearchBar;
