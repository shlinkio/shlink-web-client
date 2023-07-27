import { useParams } from 'react-router-dom';
import { useGoBack } from '../../src/utils/helpers/hooks';
import type { ShlinkVisitsParams } from '../api-contract';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import type { ColorGenerator } from '../utils/services/ColorGenerator';
import type { ReportExporter } from '../utils/services/ReportExporter';
import type { LoadTagVisits, TagVisits as TagVisitsState } from './reducers/tagVisits';
import { TagVisitsHeader } from './TagVisitsHeader';
import type { NormalizedVisit } from './types';
import { toApiParams } from './types/helpers';
import { VisitsStats } from './VisitsStats';

export interface TagVisitsProps {
  getTagVisits: (params: LoadTagVisits) => void;
  tagVisits: TagVisitsState;
  cancelGetTagVisits: () => void;
}

export const TagVisits = (colorGenerator: ColorGenerator, { exportVisits }: ReportExporter) => boundToMercureHub(({
  getTagVisits,
  tagVisits,
  cancelGetTagVisits,
}: TagVisitsProps) => {
  const goBack = useGoBack();
  const { tag = '' } = useParams();
  const loadVisits = (params: ShlinkVisitsParams, doIntervalFallback?: boolean) =>
    getTagVisits({ tag, query: toApiParams(params), doIntervalFallback });
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits(`tag_${tag}_visits.csv`, visits);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetTagVisits}
      visitsInfo={tagVisits}
      exportCsv={exportCsv}
    >
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={colorGenerator} />
    </VisitsStats>
  );
}, () => [Topics.visits]);
