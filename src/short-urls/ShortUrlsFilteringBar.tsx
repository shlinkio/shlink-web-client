import { FC } from 'react';
import { isEmpty, pipe } from 'ramda';
import { Button, InputGroup, Row, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faTags } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { SearchField } from '../utils/SearchField';
import { DateRangeSelector } from '../utils/dates/DateRangeSelector';
import { formatIsoDate } from '../utils/helpers/date';
import { DateRange, datesToDateRange } from '../utils/helpers/dateIntervals';
import { supportsAllTagsFiltering } from '../utils/helpers/features';
import { SelectedServer } from '../servers/data';
import { OrderDir } from '../utils/helpers/ordering';
import { OrderingDropdown } from '../utils/OrderingDropdown';
import { useShortUrlsQuery } from './helpers/hooks';
import { SHORT_URLS_ORDERABLE_FIELDS, ShortUrlsOrder, ShortUrlsOrderableFields } from './data';
import { ExportShortUrlsBtnProps } from './helpers/ExportShortUrlsBtn';
import { TagsSelectorProps } from '../tags/helpers/TagsSelector';
import './ShortUrlsFilteringBar.scss';

export interface ShortUrlsFilteringProps {
  selectedServer: SelectedServer;
  order: ShortUrlsOrder;
  handleOrderBy: (orderField?: ShortUrlsOrderableFields, orderDir?: OrderDir) => void;
  className?: string;
  shortUrlsAmount?: number;
}

export const ShortUrlsFilteringBar = (
  ExportShortUrlsBtn: FC<ExportShortUrlsBtnProps>,
  TagsSelector: FC<TagsSelectorProps>,
): FC<ShortUrlsFilteringProps> => ({ selectedServer, className, shortUrlsAmount, order, handleOrderBy }) => {
  const [{ search, tags, startDate, endDate, tagsMode = 'any' }, toFirstPage] = useShortUrlsQuery();
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
  const canChangeTagsMode = supportsAllTagsFiltering(selectedServer);
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
          <DateRangeSelector
            defaultText="All short URLs"
            initialDateRange={datesToDateRange(startDate, endDate)}
            onDatesChange={setDates}
          />
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
