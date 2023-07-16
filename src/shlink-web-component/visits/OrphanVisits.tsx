import type { ReportExporter } from '../../common/services/ReportExporter';
import { boundToMercureHub } from '../../mercure/helpers/boundToMercureHub';
import { Topics } from '../../mercure/helpers/Topics';
import { useGoBack } from '../../utils/helpers/hooks';
import type { LoadOrphanVisits } from './reducers/orphanVisits';
import type { VisitsInfo } from './reducers/types';
import type { NormalizedVisit, VisitsParams } from './types';
import type { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';
import { VisitsHeader } from './VisitsHeader';
import { VisitsStats } from './VisitsStats';

export interface OrphanVisitsProps extends CommonVisitsProps {
  getOrphanVisits: (params: LoadOrphanVisits) => void;
  orphanVisits: VisitsInfo;
  cancelGetOrphanVisits: () => void;
}

export const OrphanVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  getOrphanVisits,
  orphanVisits,
  cancelGetOrphanVisits,
  settings,
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
      settings={settings}
      exportCsv={exportCsv}
      isOrphanVisits
    >
      <VisitsHeader title="Orphan visits" goBack={goBack} visits={orphanVisits.visits} />
    </VisitsStats>
  );
}, () => [Topics.orphanVisits]);
