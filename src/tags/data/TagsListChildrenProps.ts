import { SelectedServer } from '../../servers/data';
import { Order } from '../../utils/helpers/ordering';
import { NormalizedTag } from './index';

export const SORTABLE_FIELDS = {
  tag: 'Tag',
  shortUrls: 'Short URLs',
  visits: 'Visits',
};

export type OrderableFields = keyof typeof SORTABLE_FIELDS;

export type TagsOrder = Order<OrderableFields>;

export interface TagsListChildrenProps {
  sortedTags: NormalizedTag[];
  selectedServer: SelectedServer;
}
