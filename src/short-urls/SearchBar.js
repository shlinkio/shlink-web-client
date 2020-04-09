import { faTags as tagsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { isEmpty, pipe } from 'ramda';
import PropTypes from 'prop-types';
import moment from 'moment';
import SearchField from '../utils/SearchField';
import Tag from '../tags/helpers/Tag';
import DateRangeRow from '../utils/DateRangeRow';
import { formatDate } from '../utils/helpers/date';
import { shortUrlsListParamsType } from './reducers/shortUrlsListParams';
import './SearchBar.scss';

const propTypes = {
  listShortUrls: PropTypes.func,
  shortUrlsListParams: shortUrlsListParamsType,
};

const dateOrUndefined = (date) => date ? moment(date) : undefined;

const SearchBar = (colorGenerator, ForServerVersion) => {
  const SearchBar = ({ listShortUrls, shortUrlsListParams }) => {
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

        <ForServerVersion minVersion="1.21.0">
          <div className="mt-3">
            <div className="row">
              <div className="col-lg-8 offset-lg-4 col-xl-6 offset-xl-6">
                <DateRangeRow
                  startDate={dateOrUndefined(shortUrlsListParams.startDate)}
                  endDate={dateOrUndefined(shortUrlsListParams.endDate)}
                  onStartDateChange={setDate('startDate')}
                  onEndDateChange={setDate('endDate')}
                />
              </div>
            </div>
          </div>
        </ForServerVersion>

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
