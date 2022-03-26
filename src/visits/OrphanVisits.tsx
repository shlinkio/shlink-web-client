import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import { useGoBack } from '../utils/helpers/hooks';
import { ReportExporter } from '../common/services/ReportExporter';
import VisitsStats from './VisitsStats';
import { OrphanVisitsHeader } from './OrphanVisitsHeader';
import { NormalizedVisit, OrphanVisitType, VisitsInfo, VisitsParams } from './types';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';

export interface OrphanVisitsProps extends CommonVisitsProps {
  getOrphanVisits: (
    params?: ShlinkVisitsParams,
    orphanVisitsType?: OrphanVisitType,
    doIntervalFallback?: boolean,
  ) => void;
  orphanVisits: VisitsInfo;
  cancelGetOrphanVisits: () => void;
}

export const OrphanVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  getOrphanVisits,
  orphanVisits,
  cancelGetOrphanVisits,
  settings,
  selectedServer,
}: OrphanVisitsProps) => {
  const goBack = useGoBack();
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits('orphan_visits.csv', visits);
  const loadVisits = (params: VisitsParams, doIntervalFallback?: boolean) =>
    getOrphanVisits(toApiParams(params), params.filter?.orphanVisitsType, doIntervalFallback);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetOrphanVisits}
      visitsInfo={orphanVisits}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
      isOrphanVisits
    >
      <OrphanVisitsHeader orphanVisits={orphanVisits} goBack={goBack} />
    </VisitsStats>
  );
}, () => [Topics.orphanVisits]);
