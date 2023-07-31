import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Result } from '../../../shlink-frontend-kit/src';
import { ShlinkApiError } from '../../common/ShlinkApiError';
import type { TagModalProps } from '../data';
import type { TagDeletion } from '../reducers/tagDelete';

interface DeleteTagConfirmModalProps extends TagModalProps {
  deleteTag: (tag: string) => Promise<void>;
  tagDeleted: (tag: string) => void;
  tagDelete: TagDeletion;
}

export const DeleteTagConfirmModal = (
  { tag, toggle, isOpen, deleteTag, tagDelete, tagDeleted }: DeleteTagConfirmModalProps,
) => {
  const { deleting, error, deleted, errorData } = tagDelete;
  const doDelete = async () => {
    await deleteTag(tag);
    toggle();
  };

  return (
    <Modal toggle={toggle} isOpen={isOpen} centered onClosed={() => deleted && tagDeleted(tag)}>
      <ModalHeader toggle={toggle} className="text-danger">Delete tag</ModalHeader>
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
