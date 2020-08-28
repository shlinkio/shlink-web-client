import PropTypes from 'prop-types';
import { ShortUrl } from '../../short-urls/data';
import { Action } from 'redux';

/** @deprecated Use Visit interface instead */
export const VisitType = PropTypes.shape({
  referer: PropTypes.string,
  date: PropTypes.string,
  userAgent: PropTypes.string,
  visitLocation: PropTypes.shape({
    countryCode: PropTypes.string,
    countryName: PropTypes.string,
    regionName: PropTypes.string,
    cityName: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    timezone: PropTypes.string,
    isEmpty: PropTypes.bool,
  }),
});

/** @deprecated Use VisitsInfo interface instead */
export const VisitsInfoType = PropTypes.shape({
  visits: PropTypes.arrayOf(VisitType),
  loading: PropTypes.bool,
  loadingLarge: PropTypes.bool,
  error: PropTypes.bool,
  progress: PropTypes.number,
});

export interface VisitsInfo {
  visits: Visit[];
  loading: boolean;
  loadingLarge: boolean;
  error: boolean;
  progress: number;
  cancelLoad: boolean;
}

export interface VisitsLoadProgressChangedAction extends Action<string> {
  progress: number;
}

interface VisitLocation {
  countryCode: string | null;
  countryName: string | null;
  regionName: string | null;
  cityName: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  isEmpty: boolean;
}

export interface Visit {
  referer: string;
  date: string;
  userAgent: string;
  visitLocation: VisitLocation | null;
}

export interface CreateVisit {
  shortUrl: ShortUrl;
  visit: Visit;
}
