import { useParams } from 'react-router-dom';
import { useGoBack } from '../../src/utils/helpers/hooks';
import type { ShlinkVisitsParams } from '../api-contract';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import type { ReportExporter } from '../utils/services/ReportExporter';
import type { DomainVisits as DomainVisitsState, LoadDomainVisits } from './reducers/domainVisits';
import type { NormalizedVisit } from './types';
import { toApiParams } from './types/helpers';
import { VisitsHeader } from './VisitsHeader';
import { VisitsStats } from './VisitsStats';

export interface DomainVisitsProps {
  getDomainVisits: (params: LoadDomainVisits) => void;
  domainVisits: DomainVisitsState;
  cancelGetDomainVisits: () => void;
}

export const DomainVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  getDomainVisits,
  domainVisits,
  cancelGetDomainVisits,
}: DomainVisitsProps) => {
  const goBack = useGoBack();
  const { domain = '' } = useParams();
  const [authority, domainId = authority] = domain.split('_');
  const loadVisits = (params: ShlinkVisitsParams, doIntervalFallback?: boolean) =>
    getDomainVisits({ domain: domainId, query: toApiParams(params), doIntervalFallback });
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits(`domain_${authority}_visits.csv`, visits);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetDomainVisits}
      visitsInfo={domainVisits}
      exportCsv={exportCsv}
    >
      <VisitsHeader goBack={goBack} visits={domainVisits.visits} title={`"${authority}" visits`} />
    </VisitsStats>
  );
}, () => [Topics.visits]);
