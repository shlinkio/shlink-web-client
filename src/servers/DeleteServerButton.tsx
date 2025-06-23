import { useToggle } from '@shlinkio/shlink-frontend-kit';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import type { ServerWithId } from './data';
import type { DeleteServerModalProps } from './DeleteServerModal';

export type DeleteServerButtonProps = PropsWithChildren<{
  server: ServerWithId;
}>;

type DeleteServerButtonDeps = {
  DeleteServerModal: FC<DeleteServerModalProps>;
};

const DeleteServerButton: FCWithDeps<DeleteServerButtonProps, DeleteServerButtonDeps> = ({ server, children }) => {
  const { DeleteServerModal } = useDependencies(DeleteServerButton);
  const { flag: isModalOpen, setToTrue: showModal, setToFalse: hideModal } = useToggle();
  const navigate = useNavigate();
  const onClose = useCallback((confirmed: boolean) => {
    hideModal();
    if (confirmed) {
      navigate('/');
    }
  }, [hideModal, navigate]);

  return (
    <>
      <button type="button" className="text-danger hover:underline" onClick={showModal}>
        {children}
      </button>
      <DeleteServerModal server={server} open={isModalOpen} onClose={onClose} />
    </>
  );
};

export const DeleteServerButtonFactory = componentFactory(DeleteServerButton, ['DeleteServerModal']);
