import { useEffect, useMemo, useState, useRef } from 'react';
import Moment from 'react-moment';
import classNames from 'classnames';
import { min, splitEvery } from 'ramda';
import {
  faCaretDown as caretDownIcon,
  faCaretUp as caretUpIcon,
  faCheck as checkIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimplePaginator from '../common/SimplePaginator';
import SearchField from '../utils/SearchField';
import { determineOrderDir, OrderDir } from '../utils/utils';
import { prettify } from '../utils/helpers/numbers';
import { NormalizedOrphanVisit, NormalizedVisit } from './types';
import './VisitsTable.scss';

interface VisitsTableProps {
  visits: NormalizedVisit[];
  selectedVisits?: NormalizedVisit[];
  setSelectedVisits: (visits: NormalizedVisit[]) => void;
  matchMedia?: (query: string) => MediaQueryList;
  isOrphanVisits?: boolean;
}

type OrderableFields = 'date' | 'country' | 'city' | 'browser' | 'os' | 'referer' | 'visitedUrl';

interface Order {
  field?: OrderableFields;
  dir?: OrderDir;
}

const PAGE_SIZE = 20;
const visitMatchesSearch = ({ browser, os, referer, country, city, ...rest }: NormalizedVisit, searchTerm: string) =>
  `${browser} ${os} ${referer} ${country} ${city} ${(rest as NormalizedOrphanVisit).visitedUrl}`.toLowerCase().includes(
    searchTerm.toLowerCase(),
  );
const searchVisits = (searchTerm: string, visits: NormalizedVisit[]) =>
  visits.filter((visit) => visitMatchesSearch(visit, searchTerm));
const sortVisits = ({ field, dir }: Order, visits: NormalizedVisit[]) => !field || !dir ? visits : visits.sort(
  (a, b) => {
    const greaterThan = dir === 'ASC' ? 1 : -1;
    const smallerThan = dir === 'ASC' ? -1 : 1;

    return (a as NormalizedOrphanVisit)[field] > (b as NormalizedOrphanVisit)[field] ? greaterThan : smallerThan;
  },
);
const calculateVisits = (allVisits: NormalizedVisit[], searchTerm: string | undefined, order: Order) => {
  const filteredVisits = searchTerm ? searchVisits(searchTerm, allVisits) : [ ...allVisits ];
  const sortedVisits = sortVisits(order, filteredVisits);
  const total = sortedVisits.length;
  const visitsGroups = splitEvery(PAGE_SIZE, sortedVisits);

  return { visitsGroups, total };
};

const VisitsTable = ({
  visits,
  selectedVisits = [],
  setSelectedVisits,
  matchMedia = window.matchMedia,
  isOrphanVisits = false,
}: VisitsTableProps) => {
  const headerCellsClass = 'visits-table__header-cell visits-table__sticky';
  const matchMobile = () => matchMedia('(max-width: 767px)').matches;

  const [ isMobileDevice, setIsMobileDevice ] = useState(matchMobile());
  const [ searchTerm, setSearchTerm ] = useState<string | undefined>(undefined);
  const [ order, setOrder ] = useState<Order>({ field: undefined, dir: undefined });
  const resultSet = useMemo(() => calculateVisits(visits, searchTerm, order), [ searchTerm, order ]);
  const isFirstLoad = useRef(true);

  const [ page, setPage ] = useState(1);
  const end = page * PAGE_SIZE;
  const start = end - PAGE_SIZE;

  const orderByColumn = (field: OrderableFields) =>
    () => setOrder({ field, dir: determineOrderDir(field, order.field, order.dir) });
  const renderOrderIcon = (field: OrderableFields) => order.dir && order.field === field && (
    <FontAwesomeIcon
      icon={order.dir === 'ASC' ? caretUpIcon : caretDownIcon}
      className="visits-table__header-icon"
    />
  );

  useEffect(() => {
    const listener = () => setIsMobileDevice(matchMobile());

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, []);
  useEffect(() => {
    setPage(1);

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    } else {
      setSelectedVisits([]);
    }
  }, [ searchTerm ]);

  return (
    <table className="table table-bordered table-hover table-sm table-responsive-sm visits-table">
      <thead className="visits-table__header">
        <tr>
          <th
            className="visits-table__header-cell visits-table__sticky text-center"
            onClick={() => setSelectedVisits(
              selectedVisits.length < resultSet.total ? resultSet.visitsGroups.flat() : [],
            )}
          >
            <FontAwesomeIcon icon={checkIcon} className={classNames({ 'text-primary': selectedVisits.length > 0 })} />
          </th>
          <th className={headerCellsClass} onClick={orderByColumn('date')}>
            Date
            {renderOrderIcon('date')}
          </th>
          <th className={headerCellsClass} onClick={orderByColumn('country')}>
            Country
            {renderOrderIcon('country')}
          </th>
          <th className={headerCellsClass} onClick={orderByColumn('city')}>
            City
            {renderOrderIcon('city')}
          </th>
          <th className={headerCellsClass} onClick={orderByColumn('browser')}>
            Browser
            {renderOrderIcon('browser')}
          </th>
          <th className={headerCellsClass} onClick={orderByColumn('os')}>
            OS
            {renderOrderIcon('os')}
          </th>
          <th className={headerCellsClass} onClick={orderByColumn('referer')}>
            Referrer
            {renderOrderIcon('referer')}
          </th>
          {isOrphanVisits && (
            <th className={headerCellsClass} onClick={orderByColumn('visitedUrl')}>
              Visited URL
              {renderOrderIcon('visitedUrl')}
            </th>
          )}
        </tr>
        <tr>
          <td colSpan={isOrphanVisits ? 8 : 7} className="p-0">
            <SearchField noBorder large={false} onChange={setSearchTerm} />
          </td>
        </tr>
      </thead>
      <tbody>
        {!resultSet.visitsGroups[page - 1]?.length && (
          <tr>
            <td colSpan={isOrphanVisits ? 8 : 7} className="text-center">
              No visits found with current filtering
            </td>
          </tr>
        )}
        {resultSet.visitsGroups[page - 1] && resultSet.visitsGroups[page - 1].map((visit, index) => {
          const isSelected = selectedVisits.includes(visit);

          return (
            <tr
              key={index}
              style={{ cursor: 'pointer' }}
              className={classNames({ 'table-active': isSelected })}
              onClick={() => setSelectedVisits(
                isSelected ? selectedVisits.filter((v) => v !== visit) : [ ...selectedVisits, visit ],
              )}
            >
              <td className="text-center">
                {isSelected && <FontAwesomeIcon icon={checkIcon} className="text-primary" />}
              </td>
              <td>
                <Moment format="YYYY-MM-DD HH:mm">{visit.date}</Moment>
              </td>
              <td>{visit.country}</td>
              <td>{visit.city}</td>
              <td>{visit.browser}</td>
              <td>{visit.os}</td>
              <td>{visit.referer}</td>
              {isOrphanVisits && <td>{(visit as NormalizedOrphanVisit).visitedUrl}</td>}
            </tr>
          );
        })}
      </tbody>
      {resultSet.total > PAGE_SIZE && (
        <tfoot>
          <tr>
            <td colSpan={isOrphanVisits ? 8 : 7} className="visits-table__footer-cell visits-table__sticky">
              <div className="row">
                <div className="col-md-6">
                  <SimplePaginator
                    pagesCount={Math.ceil(resultSet.total / PAGE_SIZE)}
                    currentPage={page}
                    setCurrentPage={setPage}
                    centered={isMobileDevice}
                  />
                </div>
                <div
                  className={classNames('col-md-6', {
                    'd-flex align-items-center flex-row-reverse': !isMobileDevice,
                    'text-center mt-3': isMobileDevice,
                  })}
                >
                  <div>
                    Visits <b>{prettify(start + 1)}</b> to{' '}
                    <b>{prettify(min(end, resultSet.total))}</b> of{' '}
                    <b>{prettify(resultSet.total)}</b>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default VisitsTable;
