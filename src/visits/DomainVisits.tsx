import { useParams } from 'react-router-dom';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { ShlinkVisitsParams } from '../api/types';
import { DomainVisits as DomainVisitsState } from './reducers/domainVisits';
import { ReportExporter } from '../common/services/ReportExporter';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import { useGoBack } from '../utils/helpers/hooks';
import { toApiParams } from './types/helpers';
import { NormalizedVisit } from './types';
import { VisitsStats } from './VisitsStats';
import { VisitsHeader } from './VisitsHeader';

export interface DomainVisitsProps extends CommonVisitsProps {
  getDomainVisits: (domain: string, query?: ShlinkVisitsParams, doIntervalFallback?: boolean) => void;
  domainVisits: DomainVisitsState;
  cancelGetDomainVisits: () => void;
}

export const DomainVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  getDomainVisits,
  domainVisits,
  cancelGetDomainVisits,
  settings,
  selectedServer,
}: DomainVisitsProps) => {
  const goBack = useGoBack();
  const { domain = '' } = useParams();
  const [authority, domainId = authority] = domain.split('_');
  const loadVisits = (params: ShlinkVisitsParams, doIntervalFallback?: boolean) =>
    getDomainVisits(domainId, toApiParams(params), doIntervalFallback);
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits(`domain_${authority}_visits.csv`, visits);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetDomainVisits}
      visitsInfo={domainVisits}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
    >
      <VisitsHeader goBack={goBack} visits={domainVisits.visits} title={`"${authority}" visits`} />
    </VisitsStats>
  );
}, () => [Topics.visits]);
