import { useEffect, useMemo, useState } from 'react';
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
import { NormalizedVisit } from './types';
import './VisitsTable.scss';

interface VisitsTableProps {
  visits: NormalizedVisit[];
  selectedVisits?: NormalizedVisit[];
  setSelectedVisits: (visits: NormalizedVisit[]) => void;
  isSticky?: boolean;
  matchMedia?: (query: string) => MediaQueryList;
}

type OrderableFields = 'date' | 'country' | 'city' | 'browser' | 'os' | 'referer';

interface Order {
  field?: OrderableFields;
  dir?: OrderDir;
}

const PAGE_SIZE = 20;
const visitMatchesSearch = ({ browser, os, referer, country, city }: NormalizedVisit, searchTerm: string) =>
  `${browser} ${os} ${referer} ${country} ${city}`.toLowerCase().includes(searchTerm.toLowerCase());
const searchVisits = (searchTerm: string, visits: NormalizedVisit[]) =>
  visits.filter((visit) => visitMatchesSearch(visit, searchTerm));
const sortVisits = ({ field, dir }: Order, visits: NormalizedVisit[]) => !field || !dir ? visits : visits.sort(
  (a, b) => {
    const greaterThan = dir === 'ASC' ? 1 : -1;
    const smallerThan = dir === 'ASC' ? -1 : 1;

    return a[field] > b[field] ? greaterThan : smallerThan;
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
  isSticky = false,
  matchMedia = window.matchMedia,
}: VisitsTableProps) => {
  const headerCellsClass = classNames('visits-table__header-cell', {
    'visits-table__sticky': isSticky,
  });
  const matchMobile = () => matchMedia('(max-width: 767px)').matches;

  const [ isMobileDevice, setIsMobileDevice ] = useState(matchMobile());
  const [ searchTerm, setSearchTerm ] = useState<string | undefined>(undefined);
  const [ order, setOrder ] = useState<Order>({ field: undefined, dir: undefined });
  const resultSet = useMemo(() => calculateVisits(visits, searchTerm, order), [ searchTerm, order ]);

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
    setSelectedVisits([]);
  }, [ searchTerm ]);

  return (
    <table className="table table-bordered table-hover table-sm table-responsive-sm visits-table">
      <thead className="visits-table__header">
        <tr>
          <th
            className={classNames('visits-table__header-cell text-center', {
              'visits-table__sticky': isSticky,
            })}
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
        </tr>
        <tr>
          <td colSpan={7} className="p-0">
            <SearchField noBorder large={false} onChange={setSearchTerm} />
          </td>
        </tr>
      </thead>
      <tbody>
        {(!resultSet.visitsGroups[page - 1] || resultSet.visitsGroups[page - 1].length === 0) && (
          <tr>
            <td colSpan={7} className="text-center">
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
              className={classNames({ 'table-primary': isSelected })}
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
            </tr>
          );
        })}
      </tbody>
      {resultSet.total > PAGE_SIZE && (
        <tfoot>
          <tr>
            <td colSpan={7} className={classNames('visits-table__footer-cell', { 'visits-table__sticky': isSticky })}>
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
