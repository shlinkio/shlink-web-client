import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import ColorGenerator from '../utils/services/ColorGenerator';
import { ShlinkVisitsParams } from '../api/types';
import { Topics } from '../mercure/helpers/Topics';
import { Settings } from '../settings/reducers/settings';
import { TagVisits as TagVisitsState } from './reducers/tagVisits';
import TagVisitsHeader from './TagVisitsHeader';
import VisitsStats from './VisitsStats';

export interface TagVisitsProps extends RouteComponentProps<{ tag: string }> {
  getTagVisits: (tag: string, query: any) => void;
  tagVisits: TagVisitsState;
  cancelGetTagVisits: () => void;
  settings: Settings;
}

const TagVisits = (colorGenerator: ColorGenerator) => boundToMercureHub(({
  history: { goBack },
  match: { params, url },
  getTagVisits,
  tagVisits,
  cancelGetTagVisits,
  settings,
}: TagVisitsProps) => {
  const { tag } = params;
  const loadVisits = (params: ShlinkVisitsParams) => getTagVisits(tag, params);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetTagVisits}
      visitsInfo={tagVisits}
      baseUrl={url}
      settings={settings}
    >
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={colorGenerator} />
    </VisitsStats>
  );
}, () => [ Topics.visits() ]);

export default TagVisits;
