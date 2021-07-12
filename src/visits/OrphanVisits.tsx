import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import VisitsStats from './VisitsStats';
import { OrphanVisitsHeader } from './OrphanVisitsHeader';
import { NormalizedVisit, OrphanVisitType, VisitsInfo, VisitsParams } from './types';
import { VisitsExporter } from './services/VisitsExporter';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';

export interface OrphanVisitsProps extends CommonVisitsProps, RouteComponentProps {
  getOrphanVisits: (params?: ShlinkVisitsParams, orphanVisitsType?: OrphanVisitType) => void;
  orphanVisits: VisitsInfo;
  cancelGetOrphanVisits: () => void;
}

export const OrphanVisits = ({ exportVisits }: VisitsExporter) => boundToMercureHub(({
  history: { goBack },
  match: { url },
  getOrphanVisits,
  orphanVisits,
  cancelGetOrphanVisits,
  settings,
  selectedServer,
}: OrphanVisitsProps) => {
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits('orphan_visits.csv', visits);
  const loadVisits = (params: VisitsParams) => getOrphanVisits(toApiParams(params), params.filter?.orphanVisitsType);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetOrphanVisits}
      visitsInfo={orphanVisits}
      baseUrl={url}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
      isOrphanVisits
    >
      <OrphanVisitsHeader orphanVisits={orphanVisits} goBack={goBack} />
    </VisitsStats>
  );
}, () => [ Topics.orphanVisits() ]);
