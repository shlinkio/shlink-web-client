import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import VisitsStats from './VisitsStats';
import { OrphanVisitsHeader } from './OrphanVisitsHeader';
import { NormalizedVisit, VisitsInfo } from './types';
import { VisitsExporter } from './services/VisitsExporter';
import { CommonVisitsProps } from './types/CommonVisitsProps';

export interface OrphanVisitsProps extends CommonVisitsProps, RouteComponentProps {
  getOrphanVisits: (params: ShlinkVisitsParams) => void;
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

  return (
    <VisitsStats
      getVisits={getOrphanVisits}
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
