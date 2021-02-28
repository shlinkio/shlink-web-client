import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import VisitsStats from './VisitsStats';
import { OrphanVisitsHeader } from './OrphanVisitsHeader';
import { VisitsInfo } from './types';

export interface OrphanVisitsProps extends RouteComponentProps {
  getOrphanVisits: (params: ShlinkVisitsParams) => void;
  orphanVisits: VisitsInfo;
  cancelGetOrphanVisits: () => void;
}

export const OrphanVisits = boundToMercureHub(({
  history: { goBack },
  match: { url },
  getOrphanVisits,
  orphanVisits,
  cancelGetOrphanVisits,
}: OrphanVisitsProps) => (
  <VisitsStats
    getVisits={getOrphanVisits}
    cancelGetVisits={cancelGetOrphanVisits}
    visitsInfo={orphanVisits}
    baseUrl={url}
  >
    <OrphanVisitsHeader orphanVisits={orphanVisits} goBack={goBack} />
  </VisitsStats>
), () => [ Topics.orphanVisits() ]);
