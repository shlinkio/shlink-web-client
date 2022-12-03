import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import { useGoBack } from '../utils/helpers/hooks';
import { ReportExporter } from '../common/services/ReportExporter';
import { VisitsStats } from './VisitsStats';
import { NormalizedVisit, VisitsParams } from './types';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';
import { VisitsHeader } from './VisitsHeader';
import { LoadVisits, VisitsInfo } from './reducers/types';

export interface NonOrphanVisitsProps extends CommonVisitsProps {
  getNonOrphanVisits: (params: LoadVisits) => void;
  nonOrphanVisits: VisitsInfo;
  cancelGetNonOrphanVisits: () => void;
}

export const NonOrphanVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  getNonOrphanVisits,
  nonOrphanVisits,
  cancelGetNonOrphanVisits,
  settings,
  selectedServer,
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
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
    >
      <VisitsHeader title="Non-orphan visits" goBack={goBack} visits={nonOrphanVisits.visits} />
    </VisitsStats>
  );
}, () => [Topics.visits]);
