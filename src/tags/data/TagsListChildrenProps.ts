import { SelectedServer } from '../../servers/data';
import { Order } from '../../utils/helpers/ordering';
import { NormalizedTag } from './index';

export type OrderableFields = 'tag' | 'shortUrls' | 'visits';

export type TagsOrder = Order<OrderableFields>;

export interface TagsListChildrenProps {
  sortedTags: NormalizedTag[];
  selectedServer: SelectedServer;
}
