import { FC } from 'react';
import { faTags as tagsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, pipe } from 'ramda';
import { parseISO } from 'date-fns';
import { Row } from 'reactstrap';
import classNames from 'classnames';
import SearchField from '../utils/SearchField';
import Tag from '../tags/helpers/Tag';
import { DateRangeSelector } from '../utils/dates/DateRangeSelector';
import { formatIsoDate } from '../utils/helpers/date';
import ColorGenerator from '../utils/services/ColorGenerator';
import { DateRange } from '../utils/dates/types';
import { supportsAllTagsFiltering } from '../utils/helpers/features';
import { SelectedServer } from '../servers/data';
import { TooltipToggleSwitch } from '../utils/TooltipToggleSwitch';
import { ExportBtn } from '../utils/ExportBtn';
import { useShortUrlsQuery } from './helpers/hooks';
import './ShortUrlsFilteringBar.scss';

export interface ShortUrlsFilteringProps {
  selectedServer: SelectedServer;
  className?: string;
}

const dateOrNull = (date?: string) => date ? parseISO(date) : null;

const ShortUrlsFilteringBar = (colorGenerator: ColorGenerator): FC<ShortUrlsFilteringProps> => (
  { selectedServer, className },
) => {
  const [{ search, tags, startDate, endDate, tagsMode = 'any' }, toFirstPage ] = useShortUrlsQuery();
  const selectedTags = tags?.split(',') ?? [];
  const setDates = pipe(
    ({ startDate, endDate }: DateRange) => ({
      startDate: formatIsoDate(startDate) ?? undefined,
      endDate: formatIsoDate(endDate) ?? undefined,
    }),
    toFirstPage,
  );
  const setSearch = pipe(
    (searchTerm: string) => isEmpty(searchTerm) ? undefined : searchTerm,
    (search) => toFirstPage({ search }),
  );
  const removeTag = pipe(
    (tag: string) => selectedTags.filter((selectedTag) => selectedTag !== tag),
    (tagsList) => tagsList.length === 0 ? undefined : tagsList.join(','),
    (tags) => toFirstPage({ tags }),
  );
  const canChangeTagsMode = supportsAllTagsFiltering(selectedServer);
  const toggleTagsMode = pipe(
    () => tagsMode === 'any' ? 'all' : 'any',
    (tagsMode) => toFirstPage({ tagsMode }),
  );

  return (
    <div className={classNames('short-urls-filtering-bar-container', className)}>
      <SearchField initialValue={search} onChange={setSearch} />

      <Row>
        <div className="col-lg-4 col-xl-6 mt-3">
          <ExportBtn className="btn-md-block" amount={4} onClick={() => {}} />
        </div>
        <div className="col-lg-8 col-xl-6 mt-3">
          <DateRangeSelector
            defaultText="All short URLs"
            initialDateRange={{
              startDate: dateOrNull(startDate),
              endDate: dateOrNull(endDate),
            }}
            onDatesChange={setDates}
          />
        </div>
      </Row>

      {selectedTags.length > 0 && (
        <h4 className="mt-3">
          {canChangeTagsMode && selectedTags.length > 1 && (
            <div className="float-end ms-2 mt-1">
              <TooltipToggleSwitch
                checked={tagsMode === 'all'}
                tooltip={{ placement: 'left' }}
                onChange={toggleTagsMode}
              >
                {tagsMode === 'all' ? 'Short URLs including all tags.' : 'Short URLs including any tag.'}
              </TooltipToggleSwitch>
            </div>
          )}
          <FontAwesomeIcon icon={tagsIcon} className="short-urls-filtering-bar__tags-icon me-1" />
          {selectedTags.map((tag) =>
            <Tag colorGenerator={colorGenerator} key={tag} text={tag} clearable onClose={() => removeTag(tag)} />)}
        </h4>
      )}
    </div>
  );
};

export default ShortUrlsFilteringBar;
