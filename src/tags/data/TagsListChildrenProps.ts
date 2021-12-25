import { SelectedServer } from '../../servers/data';
import { Order } from '../../utils/helpers/ordering';
import { NormalizedTag } from './index';

export const TAGS_ORDERABLE_FIELDS = {
  tag: 'Tag',
  shortUrls: 'Short URLs',
  visits: 'Visits',
};

export type TagsOrderableFields = keyof typeof TAGS_ORDERABLE_FIELDS;

export type TagsOrder = Order<TagsOrderableFields>;

export interface TagsListChildrenProps {
  sortedTags: NormalizedTag[];
  selectedServer: SelectedServer;
}
