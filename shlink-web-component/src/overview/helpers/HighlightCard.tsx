import { faArrowAltCircleRight as linkIcon } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardText, CardTitle, UncontrolledTooltip } from 'reactstrap';
import { useElementRef } from '../../../../shlink-frontend-kit/src';
import './HighlightCard.scss';

export type HighlightCardProps = PropsWithChildren<{
  title: string;
  link: string;
  tooltip?: ReactNode;
}>;

const buildExtraProps = (link: string) => ({ tag: Link, to: link });

export const HighlightCard: FC<HighlightCardProps> = ({ children, title, link, tooltip }) => {
  const ref = useElementRef<HTMLElement>();

  return (
    <>
      <Card innerRef={ref} className="highlight-card" body {...buildExtraProps(link)}>
        <FontAwesomeIcon size="3x" className="highlight-card__link-icon" icon={linkIcon} />
        <CardTitle tag="h5" className="highlight-card__title">{title}</CardTitle>
        <CardText tag="h2">{children}</CardText>
      </Card>
      {tooltip && <UncontrolledTooltip target={ref} placement="bottom">{tooltip}</UncontrolledTooltip>}
    </>
  );
};
