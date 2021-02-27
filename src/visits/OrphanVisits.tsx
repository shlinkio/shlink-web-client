import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { TagVisits as TagVisitsState } from './reducers/tagVisits';
import VisitsStats from './VisitsStats';
import { OrphanVisitsHeader } from './OrphanVisitsHeader';

export interface OrphanVisitsProps extends RouteComponentProps<{ tag: string }> {
  getOrphanVisits: (params: ShlinkVisitsParams) => void;
  orphanVisits: TagVisitsState;
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
), () => 'https://shlink.io/new-orphan-visit');
