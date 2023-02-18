import type { IContainer } from 'bottlejs';
import type Bottle from 'bottlejs';
import { prop } from 'ramda';
import type { ConnectDecorator } from '../../container/types';
import { DeleteTagConfirmModal } from '../helpers/DeleteTagConfirmModal';
import { EditTagModal } from '../helpers/EditTagModal';
import { TagsSelector } from '../helpers/TagsSelector';
import { tagDeleted, tagDeleteReducerCreator } from '../reducers/tagDelete';
import { editTag, tagEdited, tagEditReducerCreator } from '../reducers/tagEdit';
import { filterTags, listTags, tagsListReducerCreator } from '../reducers/tagsList';
import { TagsList } from '../TagsList';
import { TagsTable } from '../TagsTable';
import { TagsTableRow } from '../TagsTableRow';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('TagsSelector', TagsSelector, 'ColorGenerator');
  bottle.decorator('TagsSelector', connect(['tagsList', 'settings'], ['listTags']));

  bottle.serviceFactory('DeleteTagConfirmModal', () => DeleteTagConfirmModal);
  bottle.decorator('DeleteTagConfirmModal', connect(['tagDelete'], ['deleteTag', 'tagDeleted']));

  bottle.serviceFactory('EditTagModal', EditTagModal, 'ColorGenerator');
  bottle.decorator('EditTagModal', connect(['tagEdit'], ['editTag', 'tagEdited']));

  bottle.serviceFactory('TagsTableRow', TagsTableRow, 'DeleteTagConfirmModal', 'EditTagModal', 'ColorGenerator');

  bottle.serviceFactory('TagsTable', TagsTable, 'TagsTableRow');

  bottle.serviceFactory('TagsList', TagsList, 'TagsTable');
  bottle.decorator('TagsList', connect(
    ['tagsList', 'selectedServer', 'mercureInfo', 'settings'],
    ['forceListTags', 'filterTags', 'createNewVisits', 'loadMercureInfo'],
  ));

  // Reducers
  bottle.serviceFactory('tagEditReducerCreator', tagEditReducerCreator, 'editTag');
  bottle.serviceFactory('tagEditReducer', prop('reducer'), 'tagEditReducerCreator');

  bottle.serviceFactory('tagDeleteReducerCreator', tagDeleteReducerCreator, 'buildShlinkApiClient');
  bottle.serviceFactory('tagDeleteReducer', prop('reducer'), 'tagDeleteReducerCreator');

  bottle.serviceFactory('tagsListReducerCreator', tagsListReducerCreator, 'listTags', 'createShortUrl');
  bottle.serviceFactory('tagsListReducer', prop('reducer'), 'tagsListReducerCreator');

  // Actions
  const listTagsActionFactory = (force: boolean) =>
    ({ buildShlinkApiClient }: IContainer) => listTags(buildShlinkApiClient, force);

  bottle.factory('listTags', listTagsActionFactory(false));
  bottle.factory('forceListTags', listTagsActionFactory(true));
  bottle.serviceFactory('filterTags', () => filterTags);

  bottle.serviceFactory('deleteTag', prop('deleteTag'), 'tagDeleteReducerCreator');
  bottle.serviceFactory('tagDeleted', () => tagDeleted);

  bottle.serviceFactory('editTag', editTag, 'buildShlinkApiClient', 'ColorGenerator');
  bottle.serviceFactory('tagEdited', () => tagEdited);
};
