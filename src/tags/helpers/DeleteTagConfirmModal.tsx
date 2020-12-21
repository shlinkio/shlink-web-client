import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { TagDeletion } from '../reducers/tagDelete';
import { TagModalProps } from '../data';
import { Result } from '../../utils/Result';

interface DeleteTagConfirmModalProps extends TagModalProps {
  deleteTag: (tag: string) => Promise<void>;
  tagDeleted: (tag: string) => void;
  tagDelete: TagDeletion;
}

const DeleteTagConfirmModal = (
  { tag, toggle, isOpen, deleteTag, tagDelete, tagDeleted }: DeleteTagConfirmModalProps,
) => {
  const doDelete = async () => {
    await deleteTag(tag);
    tagDeleted(tag);
    toggle();
  };

  return (
    <Modal toggle={toggle} isOpen={isOpen} centered>
      <ModalHeader toggle={toggle}>
        <span className="text-danger">Delete tag</span>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete tag <b>{tag}</b>?
        {tagDelete.error && (
          <Result type="error" small textCentered className="mt-2">
            Something went wrong while deleting the tag :(
          </Result>
        )}
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-link" onClick={toggle}>Cancel</button>
        <button className="btn btn-danger" disabled={tagDelete.deleting} onClick={doDelete}>
          {tagDelete.deleting ? 'Deleting tag...' : 'Delete tag'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteTagConfirmModal;
