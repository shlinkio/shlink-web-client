import PropTypes from 'prop-types';

export const VisitType = PropTypes.shape({
  referer: PropTypes.string,
  date: PropTypes.string,
  userAgent: PropTypes.string,
  visitLocations: PropTypes.shape({
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

export const VisitsInfoType = PropTypes.shape({
  visits: PropTypes.arrayOf(VisitType),
  loading: PropTypes.bool,
  error: PropTypes.bool,
});
