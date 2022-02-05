import VisitsHeader from './VisitsHeader';
import { VisitsInfo } from './types';
import './ShortUrlVisitsHeader.scss';

interface NonOrphanVisitsHeaderProps {
  nonOrphanVisits: VisitsInfo;
  goBack: () => void;
}

export const NonOrphanVisitsHeader = ({ nonOrphanVisits, goBack }: NonOrphanVisitsHeaderProps) => {
  const { visits } = nonOrphanVisits;

  return <VisitsHeader title="Non-orphan visits" goBack={goBack} visits={visits} />;
};
