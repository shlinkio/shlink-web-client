import { CardProps } from 'reactstrap/lib/Card';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { ReactNode } from 'react';

interface SimpleCardProps extends Omit<CardProps, 'title'> {
  title?: ReactNode;
}

export const SimpleCard = ({ title, children, ...rest }: SimpleCardProps) => (
  <Card {...rest}>
    {title && <CardHeader>{title}</CardHeader>}
    <CardBody>{children}</CardBody>
  </Card>
);
