import { CardProps } from 'reactstrap/lib/Card';
import { Card, CardBody, CardHeader } from 'reactstrap';

interface SimpleCardProps extends CardProps {
  title?: string;
}

export const SimpleCard = ({ title, children, ...rest }: SimpleCardProps) => (
  <Card {...rest}>
    {title && <CardHeader>{title}</CardHeader>}
    <CardBody>{children}</CardBody>
  </Card>
);
