import { faTags as tagsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, pipe } from 'ramda';
import { parseISO } from 'date-fns';
import SearchField from '../utils/SearchField';
import Tag from '../tags/helpers/Tag';
import { DateRangeSelector } from '../utils/dates/DateRangeSelector';
import { formatIsoDate } from '../utils/helpers/date';
import ColorGenerator from '../utils/services/ColorGenerator';
import { DateRange } from '../utils/dates/types';
import { ShortUrlsListParams } from './reducers/shortUrlsListParams';
import './SearchBar.scss';

interface SearchBarProps {
  listShortUrls: (params: ShortUrlsListParams) => void;
  shortUrlsListParams: ShortUrlsListParams;
}

const dateOrNull = (date?: string) => date ? parseISO(date) : null;

const SearchBar = (colorGenerator: ColorGenerator) => ({ listShortUrls, shortUrlsListParams }: SearchBarProps) => {
  const selectedTags = shortUrlsListParams.tags ?? [];
  const setDates = pipe(
    ({ startDate, endDate }: DateRange) => ({
      startDate: formatIsoDate(startDate) ?? undefined,
      endDate: formatIsoDate(endDate) ?? undefined,
    }),
    (dates) => listShortUrls({ ...shortUrlsListParams, ...dates }),
  );

  return (
    <div className="search-bar-container">
      <SearchField
        onChange={
          (searchTerm) => listShortUrls({ ...shortUrlsListParams, searchTerm })
        }
      />

      <div className="mt-3">
        <div className="row">
          <div className="col-lg-8 offset-lg-4 col-xl-6 offset-xl-6">
            <DateRangeSelector
              defaultText="All short URLs"
              initialDateRange={{
                startDate: dateOrNull(shortUrlsListParams.startDate),
                endDate: dateOrNull(shortUrlsListParams.endDate),
              }}
              onDatesChange={setDates}
            />
          </div>
        </div>
      </div>

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
