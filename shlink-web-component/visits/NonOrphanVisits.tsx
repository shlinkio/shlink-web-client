import type { ReportExporter } from '../../src/common/services/ReportExporter';
import { useGoBack } from '../../src/utils/helpers/hooks';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import type { LoadVisits, VisitsInfo } from './reducers/types';
import type { NormalizedVisit, VisitsParams } from './types';
import { toApiParams } from './types/helpers';
import { VisitsHeader } from './VisitsHeader';
import { VisitsStats } from './VisitsStats';

export interface NonOrphanVisitsProps {
  getNonOrphanVisits: (params: LoadVisits) => void;
  nonOrphanVisits: VisitsInfo;
  cancelGetNonOrphanVisits: () => void;
}

export const NonOrphanVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  getNonOrphanVisits,
  nonOrphanVisits,
  cancelGetNonOrphanVisits,
}: NonOrphanVisitsProps) => {
  const goBack = useGoBack();
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits('non_orphan_visits.csv', visits);
  const loadVisits = (params: VisitsParams, doIntervalFallback?: boolean) =>
    getNonOrphanVisits({ query: toApiParams(params), doIntervalFallback });

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetNonOrphanVisits}
      visitsInfo={nonOrphanVisits}
      exportCsv={exportCsv}
    >
      <VisitsHeader title="Non-orphan visits" goBack={goBack} visits={nonOrphanVisits.visits} />
    </VisitsStats>
  );
}, () => [Topics.visits]);
