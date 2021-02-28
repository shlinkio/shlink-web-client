import VisitsHeader from './VisitsHeader';
import './ShortUrlVisitsHeader.scss';
import { VisitsInfo } from './types';

interface OrphanVisitsHeader {
  orphanVisits: VisitsInfo;
  goBack: () => void;
}

export const OrphanVisitsHeader = ({ orphanVisits, goBack }: OrphanVisitsHeader) => {
  const { visits } = orphanVisits;

  return <VisitsHeader title="Orphan visits" goBack={goBack} visits={visits} />;
};
