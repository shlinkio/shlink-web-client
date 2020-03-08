import PropTypes from 'prop-types';

const regularServerType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  apiKey: PropTypes.string,
  version: PropTypes.string,
  printableVersion: PropTypes.string,
});

const notFoundServerType = PropTypes.shape({
  serverNotFound: PropTypes.bool.isRequired,
});

const notReachableServerType = PropTypes.shape({
  serverNotReachable: PropTypes.bool.isRequired,
});

export const serverType = PropTypes.oneOfType([
  regularServerType,
  notFoundServerType,
  notReachableServerType,
]);
