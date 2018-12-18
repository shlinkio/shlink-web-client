import TagsSelector from '../helpers/TagsSelector';
import TagCard from '../TagCard';
import DeleteTagConfirmModal from '../helpers/DeleteTagConfirmModal';
import EditTagModal from '../helpers/EditTagModal';
import TagsList from '../TagsList';
import { filterTags, forceListTags, listTags } from '../reducers/tagsList';
import { deleteTag, tagDeleted } from '../reducers/tagDelete';
import { editTag, tagEdited } from '../reducers/tagEdit';

const provideServices = (bottle, connect) => {
  // Components
  bottle.serviceFactory('TagsSelector', TagsSelector, 'ColorGenerator');
  bottle.decorator('TagsSelector', connect([ 'tagsList' ], [ 'listTags' ]));

  bottle.serviceFactory('TagCard', TagCard, 'DeleteTagConfirmModal', 'EditTagModal', 'ColorGenerator');

  bottle.serviceFactory('DeleteTagConfirmModal', () => DeleteTagConfirmModal);
  bottle.decorator('DeleteTagConfirmModal', connect([ 'tagDelete' ], [ 'deleteTag', 'tagDeleted' ]));

  bottle.serviceFactory('EditTagModal', EditTagModal, 'ColorGenerator');
  bottle.decorator('EditTagModal', connect([ 'tagEdit' ], [ 'editTag', 'tagEdited' ]));

  bottle.serviceFactory('TagsList', TagsList, 'TagCard');
  bottle.decorator('TagsList', connect([ 'tagsList' ], [ 'forceListTags', 'filterTags' ]));

  // Actions
  bottle.serviceFactory('filterTags', () => filterTags);
  bottle.serviceFactory('forceListTags', () => forceListTags);
  bottle.serviceFactory('listTags', () => listTags);
  bottle.serviceFactory('tagDeleted', () => tagDeleted);
  bottle.serviceFactory('tagEdited', () => tagEdited);

  bottle.serviceFactory('deleteTag', deleteTag, 'buildShlinkApiClient');
  bottle.serviceFactory('editTag', editTag, 'buildShlinkApiClient', 'ColorGenerator');
};

export default provideServices;
