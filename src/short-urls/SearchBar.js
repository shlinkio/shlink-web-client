import { faTags as tagsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { isEmpty, pipe } from 'ramda';
import PropTypes from 'prop-types';
import moment from 'moment';
import SearchField from '../utils/SearchField';
import Tag from '../tags/helpers/Tag';
import DateRangeRow from '../utils/DateRangeRow';
import { compareVersions, formatDate } from '../utils/utils';
import { serverType } from '../servers/prop-types';
import { shortUrlsListParamsType } from './reducers/shortUrlsListParams';
import './SearchBar.scss';

const propTypes = {
  listShortUrls: PropTypes.func,
  shortUrlsListParams: shortUrlsListParamsType,
  selectedServer: serverType,
};

const dateOrUndefined = (date) => date ? moment(date) : undefined;

const SearchBar = (colorGenerator) => {
  const SearchBar = ({ listShortUrls, shortUrlsListParams, selectedServer }) => {
    const currentServerVersion = selectedServer ? selectedServer.version : '';
    const enableDateFiltering = !isEmpty(currentServerVersion) && compareVersions(currentServerVersion, '>=', '1.21.0');
    const selectedTags = shortUrlsListParams.tags || [];
    const setDate = (dateName) => pipe(
      formatDate(),
      (date) => listShortUrls({ ...shortUrlsListParams, [dateName]: date })
    );

    return (
      <div className="search-bar-container">
        <SearchField
          onChange={
            (searchTerm) => listShortUrls({ ...shortUrlsListParams, searchTerm })
          }
        />

        {enableDateFiltering && (
          <div className="mt-3">
            <DateRangeRow
              startDate={dateOrUndefined(shortUrlsListParams.startDate)}
              endDate={dateOrUndefined(shortUrlsListParams.endDate)}
              onStartDateChange={setDate('startDate')}
              onEndDateChange={setDate('endDate')}
            />
          </div>
        )}

        {!isEmpty(selectedTags) && (
          <h4 className="search-bar__selected-tag mt-3">
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
