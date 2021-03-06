import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import { Settings } from '../settings/reducers/settings';
import VisitsStats from './VisitsStats';
import { OrphanVisitsHeader } from './OrphanVisitsHeader';
import { VisitsInfo } from './types';

export interface OrphanVisitsProps extends RouteComponentProps {
  getOrphanVisits: (params: ShlinkVisitsParams) => void;
  orphanVisits: VisitsInfo;
  cancelGetOrphanVisits: () => void;
  settings: Settings;
}

export const OrphanVisits = boundToMercureHub(({
  history: { goBack },
  match: { url },
  getOrphanVisits,
  orphanVisits,
  cancelGetOrphanVisits,
  settings,
}: OrphanVisitsProps) => (
  <VisitsStats
    getVisits={getOrphanVisits}
    cancelGetVisits={cancelGetOrphanVisits}
    visitsInfo={orphanVisits}
    baseUrl={url}
    settings={settings}
  >
    <OrphanVisitsHeader orphanVisits={orphanVisits} goBack={goBack} />
  </VisitsStats>
), () => [ Topics.orphanVisits() ]);
