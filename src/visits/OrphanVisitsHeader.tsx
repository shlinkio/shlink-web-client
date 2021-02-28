import VisitsHeader from './VisitsHeader';
import { VisitsInfo } from './types';
import './ShortUrlVisitsHeader.scss';

interface OrphanVisitsHeaderProps {
  orphanVisits: VisitsInfo;
  goBack: () => void;
}

export const OrphanVisitsHeader = ({ orphanVisits, goBack }: OrphanVisitsHeaderProps) => {
  const { visits } = orphanVisits;

  return <VisitsHeader title="Orphan visits" goBack={goBack} visits={visits} />;
};
