import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { FC, PropsWithChildren, ReactNode } from 'react';
import './ChartCard.scss';

type ChartCardProps = PropsWithChildren<{
  title: Function | string;
  footer?: ReactNode;
}>;

export const ChartCard: FC<ChartCardProps> = ({ title, footer, children }) => (
  <Card>
    <CardHeader className="chart-card__header">{typeof title === 'function' ? title() : title}</CardHeader>
    <CardBody>{children}</CardBody>
    {footer && <CardFooter className="chart-card__footer--sticky">{footer}</CardFooter>}
  </Card>
);
