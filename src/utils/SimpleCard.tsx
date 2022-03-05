import { Card, CardBody, CardHeader, CardProps } from 'reactstrap';
import { ReactNode } from 'react';

interface SimpleCardProps extends Omit<CardProps, 'title'> {
  title?: ReactNode;
  bodyClassName?: string;
}

export const SimpleCard = ({ title, children, bodyClassName, ...rest }: SimpleCardProps) => (
  <Card {...rest}>
    {title && <CardHeader>{title}</CardHeader>}
    <CardBody className={bodyClassName}>{children}</CardBody>
  </Card>
);
