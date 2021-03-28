import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import { Settings } from '../settings/reducers/settings';
import VisitsStats from './VisitsStats';
import { OrphanVisitsHeader } from './OrphanVisitsHeader';
import { NormalizedVisit, VisitsInfo } from './types';
import { VisitsExporter } from './services/VisitsExporter';

export interface OrphanVisitsProps extends RouteComponentProps {
  getOrphanVisits: (params: ShlinkVisitsParams) => void;
  orphanVisits: VisitsInfo;
  cancelGetOrphanVisits: () => void;
  settings: Settings;
}

export const OrphanVisits = ({ exportVisits }: VisitsExporter) => boundToMercureHub(({
  history: { goBack },
  match: { url },
  getOrphanVisits,
  orphanVisits,
  cancelGetOrphanVisits,
  settings,
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
      isOrphanVisits
    >
      <OrphanVisitsHeader orphanVisits={orphanVisits} goBack={goBack} />
    </VisitsStats>
  );
}, () => [ Topics.orphanVisits() ]);
