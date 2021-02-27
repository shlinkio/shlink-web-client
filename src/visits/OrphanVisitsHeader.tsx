import VisitsHeader from './VisitsHeader';
import './ShortUrlVisitsHeader.scss';
import { VisitsInfo } from './types';

interface OrphanVisitsHeader {
  orphanVisits: VisitsInfo;
  goBack: () => void;
}

export const OrphanVisitsHeader = ({ orphanVisits, goBack }: OrphanVisitsHeader) => {
  const { visits } = orphanVisits;
  const visitsStatsTitle = <span className="mr-2">Orphan visits</span>;

  return <VisitsHeader title={visitsStatsTitle} goBack={goBack} visits={visits} />;
};
