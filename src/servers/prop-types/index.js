import PropTypes from 'prop-types';

const regularServerType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  apiKey: PropTypes.string,
  version: PropTypes.string,
  printableVersion: PropTypes.string,
  serverNotReachable: PropTypes.bool,
});

const notFoundServerType = PropTypes.shape({
  serverNotFound: PropTypes.bool.isRequired,
});

/** @deprecated Use SelectedServer type instead */
export const serverType = PropTypes.oneOfType([
  regularServerType,
  notFoundServerType,
]);
