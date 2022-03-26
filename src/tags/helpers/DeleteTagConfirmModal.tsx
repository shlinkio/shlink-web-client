import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { TagDeletion } from '../reducers/tagDelete';
import { TagModalProps } from '../data';
import { Result } from '../../utils/Result';
import { ShlinkApiError } from '../../api/ShlinkApiError';

interface DeleteTagConfirmModalProps extends TagModalProps {
  deleteTag: (tag: string) => Promise<void>;
  tagDeleted: (tag: string) => void;
  tagDelete: TagDeletion;
}

const DeleteTagConfirmModal = (
  { tag, toggle, isOpen, deleteTag, tagDelete, tagDeleted }: DeleteTagConfirmModalProps,
) => {
  const { deleting, error, errorData } = tagDelete;
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
        {error && (
          <Result type="error" small className="mt-2">
            <ShlinkApiError errorData={errorData} fallbackMessage="Something went wrong while deleting the tag :(" />
          </Result>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="link" onClick={toggle}>Cancel</Button>
        <Button color="danger" disabled={deleting} onClick={doDelete}>
          {deleting ? 'Deleting tag...' : 'Delete tag'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteTagConfirmModal;
