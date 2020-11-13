import { faTags as tagsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { isEmpty, pipe } from 'ramda';
import moment from 'moment';
import SearchField from '../utils/SearchField';
import Tag from '../tags/helpers/Tag';
import DateRangeRow from '../utils/DateRangeRow';
import { formatDate } from '../utils/helpers/date';
import ColorGenerator from '../utils/services/ColorGenerator';
import { Versions } from '../utils/helpers/version';
import { ShortUrlsListParams } from './reducers/shortUrlsListParams';
import './SearchBar.scss';

interface SearchBarProps {
  listShortUrls: (params: ShortUrlsListParams) => void;
  shortUrlsListParams: ShortUrlsListParams;
}

const dateOrNull = (date?: string) => date ? moment(date) : null;

const SearchBar = (colorGenerator: ColorGenerator, ForServerVersion: FC<Versions>) => (
  { listShortUrls, shortUrlsListParams }: SearchBarProps,
) => {
  const selectedTags = shortUrlsListParams.tags ?? [];
  const setDate = (dateName: 'startDate' | 'endDate') => pipe(
    formatDate(),
    (date) => listShortUrls({ ...shortUrlsListParams, [dateName]: date }),
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
                startDate={dateOrNull(shortUrlsListParams.startDate)}
                endDate={dateOrNull(shortUrlsListParams.endDate)}
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
                },
              )}
            />
          ))}
        </h4>
      )}
    </div>
  );
};

export default SearchBar;
