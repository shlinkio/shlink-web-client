import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { ReactNode } from 'react';
import DefaultChart, { DefaultChartProps } from './DefaultChart';
import './GraphCard.scss';

interface GraphCardProps extends DefaultChartProps {
  title: Function | string;
  footer?: ReactNode;
}

const GraphCard = ({ title, footer, ...rest }: GraphCardProps) => (
  <Card>
    <CardHeader className="graph-card__header">{typeof title === 'function' ? title() : title}</CardHeader>
    <CardBody>
      <DefaultChart {...rest} />
    </CardBody>
    {footer && <CardFooter className="graph-card__footer--sticky">{footer}</CardFooter>}
  </Card>
);

export default GraphCard;
