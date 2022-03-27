import { useParams } from 'react-router-dom';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import ColorGenerator from '../utils/services/ColorGenerator';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import { useGoBack } from '../utils/helpers/hooks';
import { ReportExporter } from '../common/services/ReportExporter';
import { TagVisits as TagVisitsState } from './reducers/tagVisits';
import TagVisitsHeader from './TagVisitsHeader';
import VisitsStats from './VisitsStats';
import { NormalizedVisit } from './types';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';

export interface TagVisitsProps extends CommonVisitsProps {
  getTagVisits: (tag: string, query?: ShlinkVisitsParams, doIntervalFallback?: boolean) => void;
  tagVisits: TagVisitsState;
  cancelGetTagVisits: () => void;
}

const TagVisits = (colorGenerator: ColorGenerator, { exportVisits }: ReportExporter) => boundToMercureHub(({
  getTagVisits,
  tagVisits,
  cancelGetTagVisits,
  settings,
  selectedServer,
}: TagVisitsProps) => {
  const goBack = useGoBack();
  const { tag = '' } = useParams();
  const loadVisits = (params: ShlinkVisitsParams, doIntervalFallback?: boolean) =>
    getTagVisits(tag, toApiParams(params), doIntervalFallback);
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits(`tag_${tag}_visits.csv`, visits);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetTagVisits}
      visitsInfo={tagVisits}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
    >
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={colorGenerator} />
    </VisitsStats>
  );
}, () => [Topics.visits]);

export default TagVisits;
