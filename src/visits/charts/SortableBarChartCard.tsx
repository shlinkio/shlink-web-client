import { FC, useState } from 'react';
import { fromPairs, pipe, reverse, sortBy, splitEvery, toLower, toPairs, type, zipObj } from 'ramda';
import { rangeOf } from '../../utils/utils';
import { Order } from '../../utils/helpers/ordering';
import SimplePaginator from '../../common/SimplePaginator';
import { roundTen } from '../../utils/helpers/numbers';
import SortingDropdown from '../../utils/SortingDropdown';
import PaginationDropdown from '../../utils/PaginationDropdown';
import { Stats, StatsRow } from '../types';
import { HorizontalBarChart, HorizontalBarChartProps } from './HorizontalBarChart';
import { ChartCard } from './ChartCard';

interface SortableBarChartCardProps extends Omit<HorizontalBarChartProps, 'max'> {
  title: Function | string;
  sortingItems: Record<string, string>;
  withPagination?: boolean;
  extraHeaderContent?: Function;
}

const toLowerIfString = (value: any) => type(value) === 'String' ? toLower(value) : value; // eslint-disable-line @typescript-eslint/no-unsafe-return
const pickKeyFromPair = ([ key ]: StatsRow) => key;
const pickValueFromPair = ([ , value ]: StatsRow) => value;

export const SortableBarChartCard: FC<SortableBarChartCardProps> = ({
  stats,
  highlightedStats,
  title,
  sortingItems,
  extraHeaderContent,
  withPagination = true,
  ...rest
}) => {
  const [ order, setOrder ] = useState<Order<string>>({});
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ itemsPerPage, setItemsPerPage ] = useState(50);

  const getSortedPairsForStats = (stats: Stats, sortingItems: Record<string, string>) => {
    const pairs = toPairs(stats);
    const sortedPairs = !order.field ? pairs : sortBy(
      pipe<StatsRow, string | number, string | number>(
        order.field === Object.keys(sortingItems)[0] ? pickKeyFromPair : pickValueFromPair,
        toLowerIfString,
      ),
      pairs,
    );

    return !order.dir || order.dir === 'ASC' ? sortedPairs : reverse(sortedPairs);
  };
  const determineCurrentPagePairs = (pages: StatsRow[][]): StatsRow[] => {
    const page = pages[currentPage - 1];

    if (currentPage < pages.length) {
      return page;
    }

    const firstPageLength = pages[0].length;

    // Using the "hidden" key, the chart will just replace the label by an empty string
    return [ ...page, ...rangeOf(firstPageLength - page.length, (i): StatsRow => [ `hidden_${i}`, 0 ]) ];
  };
  const renderPagination = (pagesCount: number) =>
    <SimplePaginator currentPage={currentPage} pagesCount={pagesCount} setCurrentPage={setCurrentPage} />;
  const determineStats = (stats: Stats, highlightedStats: Stats | undefined, sortingItems: Record<string, string>) => {
    const sortedPairs = getSortedPairsForStats(stats, sortingItems);
    const sortedKeys = sortedPairs.map(pickKeyFromPair);
    // The highlighted stats have to be ordered based on the regular stats, not on its own values
    const sortedHighlightedPairs = highlightedStats && toPairs(
      { ...zipObj(sortedKeys, sortedKeys.map(() => 0)), ...highlightedStats },
    );

    if (sortedPairs.length <= itemsPerPage) {
      return {
        currentPageStats: fromPairs(sortedPairs),
        currentPageHighlightedStats: sortedHighlightedPairs && fromPairs(sortedHighlightedPairs),
      };
    }

    const pages = splitEvery(itemsPerPage, sortedPairs);
    const highlightedPages = sortedHighlightedPairs && splitEvery(itemsPerPage, sortedHighlightedPairs);

    return {
      currentPageStats: fromPairs(determineCurrentPagePairs(pages)),
      currentPageHighlightedStats: highlightedPages && fromPairs(determineCurrentPagePairs(highlightedPages)),
      pagination: renderPagination(pages.length),
      max: roundTen(Math.max(...sortedPairs.map(pickValueFromPair))),
    };
  };

  const { currentPageStats, currentPageHighlightedStats, pagination, max } = determineStats(
    stats,
    highlightedStats && Object.keys(highlightedStats).length > 0 ? highlightedStats : undefined,
    sortingItems,
  );
  const activeCities = Object.keys(currentPageStats);
  const computeTitle = () => (
    <>
      {title}
      <div className="float-right">
        <SortingDropdown
          isButton={false}
          right
          items={sortingItems}
          order={order}
          onChange={(field, dir) => {
            setOrder({ field, dir });
            setCurrentPage(1);
          }}
        />
      </div>
      {withPagination && Object.keys(stats).length > 50 && (
        <div className="float-right">
          <PaginationDropdown
            toggleClassName="btn-sm p-0 mr-3"
            ranges={[ 50, 100, 200, 500 ]}
            value={itemsPerPage}
            setValue={(itemsPerPage) => {
              setItemsPerPage(itemsPerPage);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
      {extraHeaderContent && (
        <div className="float-right">
          {extraHeaderContent(pagination ? activeCities : undefined)}
        </div>
      )}
    </>
  );

  return (
    <ChartCard
      title={computeTitle}
      footer={pagination}
    >
      <HorizontalBarChart stats={currentPageStats} highlightedStats={currentPageHighlightedStats} max={max} {...rest} />
    </ChartCard>
  );
};
