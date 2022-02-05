import { FC } from 'react';
import { Card, CardText, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import './HighlightCard.scss';

export interface HighlightCardProps {
  title: string;
  link?: string;
}

export const HighlightCard: FC<HighlightCardProps> = ({ children, title, link }) => (
  <Card className="highlight-card" body {...(link && { tag: Link, to: link })}>
    <CardTitle tag="h5" className="highlight-card__title">{title}</CardTitle>
    <CardText tag="h2">{children}</CardText>
  </Card>
);
