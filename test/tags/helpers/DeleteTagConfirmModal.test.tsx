import { shallow, ShallowWrapper } from 'enzyme';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import DeleteTagConfirmModal from '../../../src/tags/helpers/DeleteTagConfirmModal';
import { TagDeletion } from '../../../src/tags/reducers/tagDelete';

describe('<DeleteTagConfirmModal />', () => {
  let wrapper: ShallowWrapper;
  const tag = 'nodejs';
  const deleteTag = jest.fn();
  const tagDeleted = jest.fn();
  const createWrapper = (tagDelete: TagDeletion) => {
    wrapper = shallow(
      <DeleteTagConfirmModal
        tag={tag}
        toggle={() => ''}
        isOpen
        deleteTag={deleteTag}
        tagDeleted={tagDeleted}
        tagDelete={tagDelete}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.resetAllMocks);

  it('asks confirmation for provided tag to be deleted', () => {
    wrapper = createWrapper({ error: false, deleting: false });
    const body = wrapper.find(ModalBody);
    const footer = wrapper.find(ModalFooter);
    const delBtn = footer.find(Button).last();

    expect(body.html()).toContain(`Are you sure you want to delete tag <b>${tag}</b>?`);
    expect(delBtn.prop('disabled')).toEqual(false);
    expect(delBtn.html()).toContain('>Delete tag<');
  });

  it('shows error message when deletion failed', () => {
    wrapper = createWrapper({ error: true, deleting: false });
    const body = wrapper.find(ModalBody);

    expect(body.html()).toContain('Something went wrong while deleting the tag :(');
  });

  it('shows loading status while deleting', () => {
    wrapper = createWrapper({ error: false, deleting: true });
    const footer = wrapper.find(ModalFooter);
    const delBtn = footer.find(Button).last();

    expect(delBtn.prop('disabled')).toEqual(true);
    expect(delBtn.html()).toContain('>Deleting tag...<');
  });

  it('deletes tag modal when btn is clicked', async () => {
    wrapper = createWrapper({ error: false, deleting: true });
    const footer = wrapper.find(ModalFooter);
    const delBtn = footer.find(Button).last();

    await delBtn.simulate('click');

    expect(deleteTag).toHaveBeenCalledTimes(1);
    expect(deleteTag).toHaveBeenCalledWith(tag);
    expect(tagDeleted).toHaveBeenCalledTimes(1);
    expect(tagDeleted).toHaveBeenCalledWith(tag);
  });

  it('does no further actions when modal is closed without deleting tag', () => {
    wrapper = createWrapper({ error: false, deleting: false });
    const modal = wrapper.find(Modal);

    modal.simulate('closed');
    expect(deleteTag).not.toHaveBeenCalled();
    expect(tagDeleted).not.toHaveBeenCalled();
  });
});
