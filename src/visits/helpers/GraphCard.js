import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import React from 'react';
import DefaultChart from './DefaultChart';
import './GraphCard.scss';

const propTypes = {
  title: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
  footer: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]),
  isBarChart: PropTypes.bool,
  stats: PropTypes.object,
  max: PropTypes.number,
  highlightedStats: PropTypes.object,
  highlightedLabel: PropTypes.string,
  onClick: PropTypes.func,
};

const GraphCard = ({ title, footer, ...rest }) => (
  <Card>
    <CardHeader className="graph-card__header">{typeof title === 'function' ? title() : title}</CardHeader>
    <CardBody>
      <DefaultChart title={title} {...rest} />
    </CardBody>
    {footer && <CardFooter className="graph-card__footer--sticky">{footer}</CardFooter>}
  </Card>
);

GraphCard.propTypes = propTypes;

export default GraphCard;
