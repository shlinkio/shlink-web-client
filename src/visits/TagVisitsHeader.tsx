import { Tag } from '../tags/helpers/Tag';
import { ColorGenerator } from '../utils/services/ColorGenerator';
import { VisitsHeader } from './VisitsHeader';
import { TagVisits } from './reducers/tagVisits';
import './ShortUrlVisitsHeader.scss';

interface TagVisitsHeaderProps {
  tagVisits: TagVisits;
  goBack: () => void;
  colorGenerator: ColorGenerator;
}

export const TagVisitsHeader = ({ tagVisits, goBack, colorGenerator }: TagVisitsHeaderProps) => {
  const { visits, tag } = tagVisits;
  const visitsStatsTitle = (
    <span className="d-flex align-items-center justify-content-center">
      <span className="me-2">Visits for</span>
      <Tag text={tag} colorGenerator={colorGenerator} />
    </span>
  );

  return <VisitsHeader title={visitsStatsTitle} goBack={goBack} visits={visits} />;
};
