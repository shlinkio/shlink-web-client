import React from 'react';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import DeleteTagConfirmModal from '../../../src/tags/helpers/DeleteTagConfirmModal';

describe('<DeleteTagConfirmModal />', () => {
  let wrapper;
  const tag = 'nodejs';
  const deleteTag = sinon.spy();
  const tagDeleted = sinon.spy();
  const createWrapper = (tagDelete) => {
    wrapper = shallow(
      <DeleteTagConfirmModal
        tag={tag}
        toggle={() => ''}
        isOpen
        deleteTag={deleteTag}
        tagDeleted={tagDeleted}
        tagDelete={tagDelete}
      />
    );

    return wrapper;
  };

  afterEach(() => {
    wrapper && wrapper.unmount();
    deleteTag.resetHistory();
    tagDeleted.resetHistory();
  });

  it('asks confirmation for provided tag to be deleted', () => {
    wrapper = createWrapper({ error: false, deleting: false });
    const body = wrapper.find(ModalBody);
    const footer = wrapper.find(ModalFooter);
    const delBtn = footer.find('.btn-danger');

    expect(body.html()).toContain(`Are you sure you want to delete tag <b>${tag}</b>?`);
    expect(delBtn.prop('disabled')).toEqual(false);
    expect(delBtn.text()).toEqual('Delete tag');
  });

  it('shows error message when deletion failed', () => {
    wrapper = createWrapper({ error: true, deleting: false });
    const body = wrapper.find(ModalBody);

    expect(body.html()).toContain('Something went wrong while deleting the tag :(');
  });

  it('shows loading status while deleting', () => {
    wrapper = createWrapper({ error: false, deleting: true });
    const footer = wrapper.find(ModalFooter);
    const delBtn = footer.find('.btn-danger');

    expect(delBtn.prop('disabled')).toEqual(true);
    expect(delBtn.text()).toEqual('Deleting tag...');
  });

  it('deletes tag modal when btn is clicked', () => {
    wrapper = createWrapper({ error: false, deleting: true });
    const footer = wrapper.find(ModalFooter);
    const delBtn = footer.find('.btn-danger');

    delBtn.simulate('click');
    expect(deleteTag.calledOnce).toEqual(true);
    expect(deleteTag.calledWith(tag)).toEqual(true);
  });

  it('does no further actions when modal is closed without deleting tag', () => {
    wrapper = createWrapper({ error: false, deleting: false });
    const modal = wrapper.find(Modal);

    modal.simulate('closed');
    expect(tagDeleted.called).toEqual(false);
  });

  it('notifies tag to be deleted when modal is closed after deleting tag', () => {
    wrapper = createWrapper({ error: false, deleting: false });
    const modal = wrapper.find(Modal);

    wrapper.instance().tagWasDeleted = true;
    modal.simulate('closed');
    expect(tagDeleted.calledOnce).toEqual(true);
    expect(tagDeleted.calledWith(tag)).toEqual(true);
  });
});
