import { TagsList as TagsListState } from '../reducers/tagsList';
import { SelectedServer } from '../../servers/data';

export interface TagsListChildrenProps {
  tagsList: TagsListState;
  selectedServer: SelectedServer;
}
