import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import VisitsStats from './VisitsStats';
import { NormalizedVisit, VisitsInfo, VisitsParams } from './types';
import { VisitsExporter } from './services/VisitsExporter';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';
import { NonOrphanVisitsHeader } from './NonOrphanVisitsHeader';

export interface NonOrphanVisitsProps extends CommonVisitsProps, RouteComponentProps {
  getNonOrphanVisits: (params?: ShlinkVisitsParams, doIntervalFallback?: boolean) => void;
  nonOrphanVisits: VisitsInfo;
  cancelGetNonOrphanVisits: () => void;
}

export const NonOrphanVisits = ({ exportVisits }: VisitsExporter) => boundToMercureHub(({
  history: { goBack },
  match: { url },
  getNonOrphanVisits,
  nonOrphanVisits,
  cancelGetNonOrphanVisits,
  settings,
  selectedServer,
}: NonOrphanVisitsProps) => {
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits('non_orphan_visits.csv', visits);
  const loadVisits = (params: VisitsParams, doIntervalFallback?: boolean) =>
    getNonOrphanVisits(toApiParams(params), doIntervalFallback);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetNonOrphanVisits}
      visitsInfo={nonOrphanVisits}
      baseUrl={url}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
    >
      <NonOrphanVisitsHeader nonOrphanVisits={nonOrphanVisits} goBack={goBack} />
    </VisitsStats>
  );
}, () => [ Topics.visits ]);
