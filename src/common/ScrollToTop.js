import { useEffect } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  location: PropTypes.object,
  children: PropTypes.node,
};

const ScrollToTop = () => {
  const ScrollToTopComp = ({ location, children }) => {
    useEffect(() => {
      scrollTo(0, 0);
    }, [ location ]);

    return children;
  };

  ScrollToTopComp.propTypes = propTypes;

  return ScrollToTopComp;
};

export default ScrollToTop;
