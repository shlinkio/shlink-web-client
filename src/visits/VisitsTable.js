import React, { useEffect, useState } from 'react';
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
import { visitType } from './reducers/shortUrlVisits';
import './VisitsTable.scss';

const propTypes = {
  visits: PropTypes.arrayOf(visitType).isRequired,
  onVisitSelected: PropTypes.func,
};

const PAGE_SIZE = 20;
const visitMatchesSearch = ({ browser, os, referer, location }, searchTerm) =>
  `${browser} ${os} ${referer} ${location}`.toLowerCase().includes(searchTerm.toLowerCase());
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
  location: visitLocation ? `${visitLocation.countryName} - ${visitLocation.cityName}` : '',
}));

const VisitsTable = ({ visits, onVisitSelected }) => {
  const allVisits = normalizeVisits(visits);

  const [ selectedVisit, setSelectedVisit ] = useState(undefined);
  const [ page, setPage ] = useState(1);
  const [ searchTerm, setSearchTerm ] = useState(undefined);
  const [ order, setOrder ] = useState({ field: undefined, dir: undefined });
  const [ currentPage, setCurrentPageVisits ] = useState(calculateVisits(allVisits, page, searchTerm, order));

  const orderByColumn = (field) => () => setOrder({ field, dir: determineOrderDir(field, order.field, order.dir) });
  const renderOrderIcon = (field) => {
    if (!order.dir || order.field !== field) {
      return null;
    }

    return (
      <FontAwesomeIcon
        icon={order.dir === 'ASC' ? caretUpIcon : caretDownIcon}
        className="visits-table__header-icon"
      />
    );
  };

  useEffect(() => {
    onVisitSelected && onVisitSelected(selectedVisit);
  }, [ selectedVisit ]);
  useEffect(() => {
    setCurrentPageVisits(calculateVisits(allVisits, page, searchTerm, order));
  }, [ page, searchTerm, order ]);

  return (
    <table className="table table-striped table-bordered table-hover table-sm table-responsive-sm mt-4 mb-0">
      <thead className="short-urls-list__header">
        <tr>
          <th className="text-center">
            <FontAwesomeIcon icon={checkIcon} />
          </th>
          <th className="short-urls-list__header-cell--with-action" onClick={orderByColumn('date')}>
            Date
            {renderOrderIcon('date')}
          </th>
          <th className="short-urls-list__header-cell--with-action" onClick={orderByColumn('location')}>
            Location
            {renderOrderIcon('location')}
          </th>
          <th className="short-urls-list__header-cell--with-action" onClick={orderByColumn('browser')}>
            Browser
            {renderOrderIcon('browser')}
          </th>
          <th className="short-urls-list__header-cell--with-action" onClick={orderByColumn('os')}>
            OS
            {renderOrderIcon('os')}
          </th>
          <th className="short-urls-list__header-cell--with-action" onClick={orderByColumn('referer')}>
            Referrer
            {renderOrderIcon('referer')}
          </th>
        </tr>
        <tr>
          <td colSpan={6} className="p-0">
            <SearchField noBorder large={false} onChange={setSearchTerm} />
          </td>
        </tr>
      </thead>
      <tbody>
        {currentPage.visits.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center">
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
            <td>{visit.location}</td>
            <td>{visit.browser}</td>
            <td>{visit.os}</td>
            <td>{visit.referer}</td>
          </tr>
        ))}
      </tbody>
      {currentPage.total >= PAGE_SIZE && (
        <tfoot>
          <tr>
            <td colSpan={6} className="p-2">
              <div className="row">
                <div className="col-6">
                  <SimplePaginator
                    pagesCount={Math.ceil(currentPage.total / PAGE_SIZE)}
                    currentPage={page}
                    setCurrentPage={setPage}
                    centered={false}
                  />
                </div>
                <div className="col-6 d-flex align-items-center flex-row-reverse">
                  <div>
                    Visits <b>{currentPage.start + 1}</b> to{' '}
                    <b>{min(currentPage.end, currentPage.total)}</b> of{' '}
                    <b>{currentPage.total}</b>
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
