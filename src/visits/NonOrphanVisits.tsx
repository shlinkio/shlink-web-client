import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import { useGoBack } from '../utils/helpers/hooks';
import { ReportExporter } from '../common/services/ReportExporter';
import VisitsStats from './VisitsStats';
import { NormalizedVisit, VisitsInfo, VisitsParams } from './types';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';
import { NonOrphanVisitsHeader } from './NonOrphanVisitsHeader';

export interface NonOrphanVisitsProps extends CommonVisitsProps {
  getNonOrphanVisits: (params?: ShlinkVisitsParams, doIntervalFallback?: boolean) => void;
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
    getNonOrphanVisits(toApiParams(params), doIntervalFallback);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetNonOrphanVisits}
      visitsInfo={nonOrphanVisits}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
    >
      <NonOrphanVisitsHeader nonOrphanVisits={nonOrphanVisits} goBack={goBack} />
    </VisitsStats>
  );
}, () => [Topics.visits]);
