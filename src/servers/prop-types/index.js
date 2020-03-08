import PropTypes from 'prop-types';

export const serverType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  version: PropTypes.string,
  printableVersion: PropTypes.string,
  serverNotFound: PropTypes.bool,
  serverNotReachable: PropTypes.bool,
});
