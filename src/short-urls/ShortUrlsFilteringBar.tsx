import { faTag, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { isEmpty, pipe } from 'ramda';
import type { FC } from 'react';
import { Button, InputGroup, Row, UncontrolledTooltip } from 'reactstrap';
import type { SelectedServer } from '../servers/data';
import type { Settings } from '../settings/reducers/settings';
import type { TagsSelectorProps } from '../tags/helpers/TagsSelector';
import { DateRangeSelector } from '../utils/dates/DateRangeSelector';
import { formatIsoDate } from '../utils/helpers/date';
import type { DateRange } from '../utils/helpers/dateIntervals';
import { datesToDateRange } from '../utils/helpers/dateIntervals';
import { useFeature } from '../utils/helpers/features';
import type { OrderDir } from '../utils/helpers/ordering';
import { OrderingDropdown } from '../utils/OrderingDropdown';
import { SearchField } from '../utils/SearchField';
import type { ShortUrlsOrder, ShortUrlsOrderableFields } from './data';
import { SHORT_URLS_ORDERABLE_FIELDS } from './data';
import type { ExportShortUrlsBtnProps } from './helpers/ExportShortUrlsBtn';
import { useShortUrlsQuery } from './helpers/hooks';
import { ShortUrlsFilterDropdown } from './helpers/ShortUrlsFilterDropdown';
import './ShortUrlsFilteringBar.scss';

interface ShortUrlsFilteringProps {
  selectedServer: SelectedServer;
  order: ShortUrlsOrder;
  settings: Settings;
  handleOrderBy: (orderField?: ShortUrlsOrderableFields, orderDir?: OrderDir) => void;
  className?: string;
  shortUrlsAmount?: number;
}

export const ShortUrlsFilteringBar = (
  ExportShortUrlsBtn: FC<ExportShortUrlsBtnProps>,
  TagsSelector: FC<TagsSelectorProps>,
): FC<ShortUrlsFilteringProps> => ({ selectedServer, className, shortUrlsAmount, order, handleOrderBy, settings }) => {
  const [filter, toFirstPage] = useShortUrlsQuery();
  const {
    search,
    tags,
    startDate,
    endDate,
    excludeBots,
    excludeMaxVisitsReached,
    excludePastValidUntil,
    tagsMode = 'any',
  } = filter;
  const supportsDisabledFiltering = useFeature('filterDisabledUrls', selectedServer);

  const setDates = pipe(
    ({ startDate: theStartDate, endDate: theEndDate }: DateRange) => ({
      startDate: formatIsoDate(theStartDate) ?? undefined,
      endDate: formatIsoDate(theEndDate) ?? undefined,
    }),
    toFirstPage,
  );
  const setSearch = pipe(
    (searchTerm: string) => (isEmpty(searchTerm) ? undefined : searchTerm),
    (searchTerm) => toFirstPage({ search: searchTerm }),
  );
  const changeTagSelection = (selectedTags: string[]) => toFirstPage({ tags: selectedTags });
  const canChangeTagsMode = useFeature('allTagsFiltering', selectedServer);
  const toggleTagsMode = pipe(
    () => (tagsMode === 'any' ? 'all' : 'any'),
    (mode) => toFirstPage({ tagsMode: mode }),
  );

  return (
    <div className={classNames('short-urls-filtering-bar-container', className)}>
      <SearchField initialValue={search} onChange={setSearch} />

      <InputGroup className="mt-3">
        <TagsSelector allowNew={false} placeholder="With tags..." selectedTags={tags} onChange={changeTagSelection} />
        {canChangeTagsMode && tags.length > 1 && (
          <>
            <Button outline color="secondary" onClick={toggleTagsMode} id="tagsModeBtn" aria-label="Change tags mode">
              <FontAwesomeIcon className="short-urls-filtering-bar__tags-icon" icon={tagsMode === 'all' ? faTags : faTag} />
            </Button>
            <UncontrolledTooltip target="tagsModeBtn" placement="left">
              {tagsMode === 'all' ? 'With all the tags.' : 'With any of the tags.'}
            </UncontrolledTooltip>
          </>
        )}
      </InputGroup>

      <Row className="flex-lg-row-reverse">
        <div className="col-lg-8 col-xl-6 mt-3">
          <div className="d-md-flex">
            <div className="flex-fill">
              <DateRangeSelector
                defaultText="All short URLs"
                initialDateRange={datesToDateRange(startDate, endDate)}
                onDatesChange={setDates}
              />
            </div>
            <ShortUrlsFilterDropdown
              className="ms-0 ms-md-2 mt-3 mt-md-0"
              selected={{
                excludeBots: excludeBots ?? settings.visits?.excludeBots,
                excludeMaxVisitsReached,
                excludePastValidUntil,
              }}
              onChange={toFirstPage}
              supportsDisabledFiltering={supportsDisabledFiltering}
            />
          </div>
        </div>
        <div className="col-6 col-lg-4 col-xl-6 mt-3">
          <ExportShortUrlsBtn amount={shortUrlsAmount} />
        </div>
        <div className="col-6 d-lg-none mt-3">
          <OrderingDropdown
            prefixed={false}
            items={SHORT_URLS_ORDERABLE_FIELDS}
            order={order}
            onChange={handleOrderBy}
          />
        </div>
      </Row>
    </div>
  );
};

export type ShortUrlsFilteringBarType = ReturnType<typeof ShortUrlsFilteringBar>;
