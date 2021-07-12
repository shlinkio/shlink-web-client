import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import ColorGenerator from '../utils/services/ColorGenerator';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import { TagVisits as TagVisitsState } from './reducers/tagVisits';
import TagVisitsHeader from './TagVisitsHeader';
import VisitsStats from './VisitsStats';
import { VisitsExporter } from './services/VisitsExporter';
import { NormalizedVisit } from './types';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';

export interface TagVisitsProps extends CommonVisitsProps, RouteComponentProps<{ tag: string }> {
  getTagVisits: (tag: string, query?: ShlinkVisitsParams) => void;
  tagVisits: TagVisitsState;
  cancelGetTagVisits: () => void;
}

const TagVisits = (colorGenerator: ColorGenerator, { exportVisits }: VisitsExporter) => boundToMercureHub(({
  history: { goBack },
  match: { params, url },
  getTagVisits,
  tagVisits,
  cancelGetTagVisits,
  settings,
  selectedServer,
}: TagVisitsProps) => {
  const { tag } = params;
  const loadVisits = (params: ShlinkVisitsParams) => getTagVisits(tag, toApiParams(params));
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits(`tag_${tag}_visits.csv`, visits);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetTagVisits}
      visitsInfo={tagVisits}
      baseUrl={url}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
    >
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={colorGenerator} />
    </VisitsStats>
  );
}, () => [ Topics.visits() ]);

export default TagVisits;
