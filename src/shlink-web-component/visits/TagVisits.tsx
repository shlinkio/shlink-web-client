import { useParams } from 'react-router-dom';
import type { ShlinkVisitsParams } from '../../api/types';
import type { ReportExporter } from '../../common/services/ReportExporter';
import { useGoBack } from '../../utils/helpers/hooks';
import type { ColorGenerator } from '../../utils/services/ColorGenerator';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
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
