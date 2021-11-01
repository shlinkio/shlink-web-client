import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { pipe, splitEvery } from 'ramda';
import { RouteChildrenProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import { SimpleCard } from '../utils/SimpleCard';
import SimplePaginator from '../common/SimplePaginator';
import { useQueryState } from '../utils/helpers/hooks';
import { parseQuery } from '../utils/helpers/query';
import { determineOrderDir, Order, sortList } from '../utils/helpers/ordering';
import { TagsListChildrenProps } from './data/TagsListChildrenProps';
import { TagsTableRowProps } from './TagsTableRow';
import { NormalizedTag } from './data';
import './TagsTable.scss';

const TAGS_PER_PAGE = 20; // TODO Allow customizing this value in settings

type OrderableFields = 'tag' | 'shortUrls' | 'visits';
type TagsOrder = Order<OrderableFields>;

export const TagsTable = (TagsTableRow: FC<TagsTableRowProps>) => (
  { tagsList, selectedServer, location }: TagsListChildrenProps & RouteChildrenProps,
) => {
  const isFirstLoad = useRef(true);
  const { page: pageFromQuery = 1 } = parseQuery<{ page?: number | string }>(location.search);
  const [ page, setPage ] = useQueryState<number>('page', Number(pageFromQuery));
  const [ order, setOrder ] = useState<TagsOrder>({});
  const sortedTags = useMemo(
    pipe(
      () => tagsList.filteredTags.map((tag): NormalizedTag => ({
        tag,
        shortUrls: tagsList.stats[tag]?.shortUrlsCount ?? 0,
        visits: tagsList.stats[tag]?.visitsCount ?? 0,
      })),
      (normalizedTags) => sortList<NormalizedTag>(normalizedTags, order),
    ),
    [ tagsList.filteredTags, order ],
  );
  const pages = splitEvery(TAGS_PER_PAGE, sortedTags);
  const showPaginator = pages.length > 1;
  const currentPage = pages[page - 1] ?? [];

  const orderByColumn = (field: OrderableFields) =>
    () => setOrder({ field, dir: determineOrderDir(field, order.field, order.dir) });
  const renderOrderIcon = (field: OrderableFields) => order.dir && order.field === field &&
    <FontAwesomeIcon icon={order.dir === 'ASC' ? caretUpIcon : caretDownIcon} className="ml-1" />;

  useEffect(() => {
    !isFirstLoad.current && setPage(1);
    isFirstLoad.current = false;
  }, [ tagsList.filteredTags ]);
  useEffect(() => {
    scrollTo(0, 0);
  }, [ page ]);

  return (
    <SimpleCard key={page} bodyClassName={showPaginator ? 'pb-1' : ''}>
      <table className="table table-hover mb-0">
        <thead className="responsive-table__header">
          <tr>
            <th className="tags-table__header-cell" onClick={orderByColumn('tag')}>Tag {renderOrderIcon('tag')}</th>
            <th className="tags-table__header-cell text-lg-right" onClick={orderByColumn('shortUrls')}>
              Short URLs {renderOrderIcon('shortUrls')}
            </th>
            <th className="tags-table__header-cell text-lg-right" onClick={orderByColumn('visits')}>
              Visits {renderOrderIcon('visits')}
            </th>
            <th className="tags-table__header-cell" />
          </tr>
          <tr><th colSpan={4} className="p-0 border-top-0" /></tr>
        </thead>
        <tbody>
          {currentPage.length === 0 && <tr><td colSpan={4} className="text-center">No results found</td></tr>}
          {currentPage.map((tag) => <TagsTableRow key={tag.tag} tag={tag} selectedServer={selectedServer} />)}
        </tbody>
      </table>

      {showPaginator && (
        <div className="sticky-card-paginator">
          <SimplePaginator pagesCount={pages.length} currentPage={page} setCurrentPage={setPage} />
        </div>
      )}
    </SimpleCard>
  );
};
