import type { ReactNode } from 'react';
import type { CardProps } from 'reactstrap';
import { Card, CardBody, CardHeader } from 'reactstrap';

interface SimpleCardProps extends Omit<CardProps, 'title'> {
  title?: ReactNode;
  bodyClassName?: string;
}

export const SimpleCard = ({ title, children, bodyClassName, ...rest }: SimpleCardProps) => (
  <Card {...rest}>
    {title && <CardHeader role="heading">{title}</CardHeader>}
    <CardBody className={bodyClassName}>{children}</CardBody>
  </Card>
);
