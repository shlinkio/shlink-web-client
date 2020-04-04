import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import classNames from 'classnames';
import { map, min } from 'ramda';
import {
  faCaretDown as caretDownIcon,
  faCaretUp as caretUpIcon,
  faCheck as checkIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimplePaginator from '../common/SimplePaginator';
import SearchField from '../utils/SearchField';
import { browserFromUserAgent, extractDomain, osFromUserAgent } from '../utils/helpers/visits';
import { determineOrderDir } from '../utils/utils';
import { prettify } from '../utils/helpers/numbers';
import { visitType } from './reducers/shortUrlVisits';
import './VisitsTable.scss';

const propTypes = {
  visits: PropTypes.arrayOf(visitType).isRequired,
  onVisitSelected: PropTypes.func,
  isSticky: PropTypes.bool,
  matchMedia: PropTypes.func,
};

const PAGE_SIZE = 20;
const visitMatchesSearch = ({ browser, os, referer, country, city }, searchTerm) =>
  `${browser} ${os} ${referer} ${country} ${city}`.toLowerCase().includes(searchTerm.toLowerCase());
const calculateVisits = (allVisits, page, searchTerm, { field, dir }) => {
  const end = page * PAGE_SIZE;
  const start = end - PAGE_SIZE;
  const filteredVisits = searchTerm ? allVisits.filter((visit) => visitMatchesSearch(visit, searchTerm)) : allVisits;
  const total = filteredVisits.length;
  const visits = filteredVisits
    .sort((a, b) => {
      if (!dir) {
        return 0;
      }

      const greaterThan = dir === 'ASC' ? 1 : -1;
      const smallerThan = dir === 'ASC' ? -1 : 1;

      return a[field] > b[field] ? greaterThan : smallerThan;
    })
    .slice(start, end);

  return { visits, start, end, total };
};
const normalizeVisits = map(({ userAgent, date, referer, visitLocation }) => ({
  date,
  browser: browserFromUserAgent(userAgent),
  os: osFromUserAgent(userAgent),
  referer: extractDomain(referer),
  country: (visitLocation && visitLocation.countryName) || 'Unknown',
  city: (visitLocation && visitLocation.cityName) || 'Unknown',
}));

const VisitsTable = ({ visits, onVisitSelected, isSticky = false, matchMedia = window.matchMedia }) => {
  const headerCellsClass = classNames('visits-table__header-cell', {
    'visits-table__sticky': isSticky,
  });
  const matchMobile = () => matchMedia('(max-width: 767px)').matches;

  const [ selectedVisit, setSelectedVisit ] = useState(undefined);
  const [ isMobileDevice, setIsMobileDevice ] = useState(matchMobile());
  const [ page, setPage ] = useState(1);
  const [ searchTerm, setSearchTerm ] = useState(undefined);
  const [ order, setOrder ] = useState({ field: undefined, dir: undefined });
  const allVisits = useMemo(() => normalizeVisits(visits), [ visits ]);
  const currentPage = useMemo(() => calculateVisits(allVisits, page, searchTerm, order), [ page, searchTerm, order ]);

  const orderByColumn = (field) => () => setOrder({ field, dir: determineOrderDir(field, order.field, order.dir) });
  const renderOrderIcon = (field) => order.dir && order.field === field && (
    <FontAwesomeIcon
      icon={order.dir === 'ASC' ? caretUpIcon : caretDownIcon}
      className="visits-table__header-icon"
    />
  );

  useEffect(() => {
    onVisitSelected && onVisitSelected(selectedVisit);
  }, [ selectedVisit ]);
  useEffect(() => {
    const listener = () => setIsMobileDevice(matchMobile());

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, []);

  return (
    <table className="table table-striped table-bordered table-hover table-sm visits-table">
      <thead className="visits-table__header">
        <tr>
          <th
            className={classNames('visits-table__header-cell visits-table__header-cell--no-action', {
              'visits-table__sticky': isSticky,
            })}
          >
            <FontAwesomeIcon icon={checkIcon} />
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
        {currentPage.visits.length === 0 && (
          <tr>
            <td colSpan={7} className="text-center">
              No visits found with current filtering
            </td>
          </tr>
        )}
        {currentPage.visits.map((visit, index) => (
          <tr
            key={index}
            style={{ cursor: 'pointer' }}
            className={classNames({ 'table-primary': selectedVisit === visit })}
            onClick={() => setSelectedVisit(selectedVisit === visit ? undefined : visit)}
          >
            <td className="text-center">
              {selectedVisit === visit && <FontAwesomeIcon icon={checkIcon} className="text-primary" />}
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
        ))}
      </tbody>
      {currentPage.total >= PAGE_SIZE && (
        <tfoot>
          <tr>
            <td colSpan={7} className={classNames('visits-table__footer-cell', { 'visits-table__sticky': isSticky })}>
              <div className="row">
                <div className="col-md-6">
                  <SimplePaginator
                    pagesCount={Math.ceil(currentPage.total / PAGE_SIZE)}
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
                    Visits <b>{prettify(currentPage.start + 1)}</b> to{' '}
                    <b>{prettify(min(currentPage.end, currentPage.total))}</b> of{' '}
                    <b>{prettify(currentPage.total)}</b>
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

VisitsTable.propTypes = propTypes;

export default VisitsTable;
