import { useGoBack } from '../../src/utils/helpers/hooks';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import type { ReportExporter } from '../utils/services/ReportExporter';
import type { LoadOrphanVisits } from './reducers/orphanVisits';
import type { VisitsInfo } from './reducers/types';
import type { NormalizedVisit, VisitsParams } from './types';
import { toApiParams } from './types/helpers';
import { VisitsHeader } from './VisitsHeader';
import { VisitsStats } from './VisitsStats';

export interface OrphanVisitsProps {
  getOrphanVisits: (params: LoadOrphanVisits) => void;
  orphanVisits: VisitsInfo;
  cancelGetOrphanVisits: () => void;
}

export const OrphanVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  getOrphanVisits,
  orphanVisits,
  cancelGetOrphanVisits,
}: OrphanVisitsProps) => {
  const goBack = useGoBack();
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits('orphan_visits.csv', visits);
  const loadVisits = (params: VisitsParams, doIntervalFallback?: boolean) => getOrphanVisits(
    { query: toApiParams(params), orphanVisitsType: params.filter?.orphanVisitsType, doIntervalFallback },
  );

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetOrphanVisits}
      visitsInfo={orphanVisits}
      exportCsv={exportCsv}
      isOrphanVisits
    >
      <VisitsHeader title="Orphan visits" goBack={goBack} visits={orphanVisits.visits} />
    </VisitsStats>
  );
}, () => [Topics.orphanVisits]);
