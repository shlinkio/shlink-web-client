import Bottle, { IContainer } from 'bottlejs';
import TagsSelector from '../helpers/TagsSelector';
import TagCard from '../TagCard';
import DeleteTagConfirmModal from '../helpers/DeleteTagConfirmModal';
import EditTagModal from '../helpers/EditTagModal';
import TagsList from '../TagsList';
import { filterTags, listTags } from '../reducers/tagsList';
import { deleteTag, tagDeleted } from '../reducers/tagDelete';
import { editTag, tagEdited } from '../reducers/tagEdit';
import { ConnectDecorator } from '../../container/types';
import { TagsCards } from '../TagsCards';
import { TagsTable } from '../TagsTable';
import { TagsTableRow } from '../TagsTableRow';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('TagsSelector', TagsSelector, 'ColorGenerator');
  bottle.decorator('TagsSelector', connect(['tagsList', 'settings'], ['listTags']));

  bottle.serviceFactory('TagCard', TagCard, 'DeleteTagConfirmModal', 'EditTagModal', 'ColorGenerator');

  bottle.serviceFactory('DeleteTagConfirmModal', () => DeleteTagConfirmModal);
  bottle.decorator('DeleteTagConfirmModal', connect(['tagDelete'], ['deleteTag', 'tagDeleted']));

  bottle.serviceFactory('EditTagModal', EditTagModal, 'ColorGenerator');
  bottle.decorator('EditTagModal', connect(['tagEdit'], ['editTag', 'tagEdited']));

  bottle.serviceFactory('TagsCards', TagsCards, 'TagCard');
  bottle.serviceFactory('TagsTableRow', TagsTableRow, 'DeleteTagConfirmModal', 'EditTagModal', 'ColorGenerator');

  bottle.serviceFactory('TagsTable', TagsTable, 'TagsTableRow');

  bottle.serviceFactory('TagsList', TagsList, 'TagsCards', 'TagsTable');
  bottle.decorator('TagsList', connect(
    ['tagsList', 'selectedServer', 'mercureInfo', 'settings'],
    ['forceListTags', 'filterTags', 'createNewVisits', 'loadMercureInfo'],
  ));

  // Actions
  const listTagsActionFactory = (force: boolean) =>
    ({ buildShlinkApiClient }: IContainer) => listTags(buildShlinkApiClient, force);

  bottle.factory('listTags', listTagsActionFactory(false));
  bottle.factory('forceListTags', listTagsActionFactory(true));
  bottle.serviceFactory('filterTags', () => filterTags);
  bottle.serviceFactory('tagDeleted', () => tagDeleted);
  bottle.serviceFactory('tagEdited', () => tagEdited);

  bottle.serviceFactory('deleteTag', deleteTag, 'buildShlinkApiClient');
  bottle.serviceFactory('editTag', editTag, 'buildShlinkApiClient', 'ColorGenerator');
};

export default provideServices;
