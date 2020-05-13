import TagsSelector from '../helpers/TagsSelector';
import TagCard from '../TagCard';
import DeleteTagConfirmModal from '../helpers/DeleteTagConfirmModal';
import EditTagModal from '../helpers/EditTagModal';
import TagsList from '../TagsList';
import { filterTags, listTags } from '../reducers/tagsList';
import { deleteTag, tagDeleted } from '../reducers/tagDelete';
import { editTag, tagEdited } from '../reducers/tagEdit';

const provideServices = (bottle, connect) => {
  // Components
  bottle.serviceFactory('TagsSelector', TagsSelector, 'ColorGenerator');
  bottle.decorator('TagsSelector', connect([ 'tagsList' ], [ 'listTags' ]));

  bottle.serviceFactory(
    'TagCard',
    TagCard,
    'DeleteTagConfirmModal',
    'EditTagModal',
    'ForServerVersion',
    'ColorGenerator'
  );

  bottle.serviceFactory('DeleteTagConfirmModal', () => DeleteTagConfirmModal);
  bottle.decorator('DeleteTagConfirmModal', connect([ 'tagDelete' ], [ 'deleteTag', 'tagDeleted' ]));

  bottle.serviceFactory('EditTagModal', EditTagModal, 'ColorGenerator');
  bottle.decorator('EditTagModal', connect([ 'tagEdit' ], [ 'editTag', 'tagEdited' ]));

  bottle.serviceFactory('TagsList', TagsList, 'TagCard');
  bottle.decorator('TagsList', connect(
    [ 'tagsList', 'selectedServer', 'mercureInfo', 'settings' ],
    [ 'forceListTags', 'filterTags', 'createNewVisit', 'loadMercureInfo' ]
  ));

  // Actions
  const listTagsActionFactory = (force) => ({ buildShlinkApiClient }) => listTags(buildShlinkApiClient, force);

  bottle.factory('listTags', listTagsActionFactory(false));
  bottle.factory('forceListTags', listTagsActionFactory(true));
  bottle.serviceFactory('filterTags', () => filterTags);
  bottle.serviceFactory('tagDeleted', () => tagDeleted);
  bottle.serviceFactory('tagEdited', () => tagEdited);

  bottle.serviceFactory('deleteTag', deleteTag, 'buildShlinkApiClient');
  bottle.serviceFactory('editTag', editTag, 'buildShlinkApiClient', 'ColorGenerator');
};

export default provideServices;
