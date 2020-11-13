import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import ColorGenerator from '../utils/services/ColorGenerator';
import { ShlinkVisitsParams } from '../utils/services/types';
import { TagVisits as TagVisitsState } from './reducers/tagVisits';
import TagVisitsHeader from './TagVisitsHeader';
import VisitsStats from './VisitsStats';

export interface TagVisitsProps extends RouteComponentProps<{ tag: string }> {
  getTagVisits: (tag: string, query: any) => void;
  tagVisits: TagVisitsState;
  cancelGetTagVisits: () => void;
}

const TagVisits = (colorGenerator: ColorGenerator) => boundToMercureHub(({
  history: { goBack },
  match,
  getTagVisits,
  tagVisits,
  cancelGetTagVisits,
}: TagVisitsProps) => {
  const { params } = match;
  const { tag } = params;
  const loadVisits = (params: ShlinkVisitsParams) => getTagVisits(tag, params);

  return (
    <VisitsStats getVisits={loadVisits} cancelGetVisits={cancelGetTagVisits} visitsInfo={tagVisits}>
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={colorGenerator} />
    </VisitsStats>
  );
}, () => 'https://shlink.io/new-visit');

export default TagVisits;
