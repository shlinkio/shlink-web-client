import { useToggle } from '@shlinkio/shlink-frontend-kit';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { ServerWithId } from './data';
import { DeleteServerModal } from './DeleteServerModal';

export type DeleteServerButtonProps = PropsWithChildren<{
  server: ServerWithId;
}>;

export const DeleteServerButton: FC<DeleteServerButtonProps> = ({ server, children }) => {
  const { flag: isModalOpen, setToTrue: showModal, setToFalse: hideModal } = useToggle();
  const navigate = useNavigate();
  const onClose = useCallback(
    (confirmed: boolean) => {
      hideModal();
      if (confirmed) {
        navigate('/');
      }
    },
    [hideModal, navigate],
  );

  return (
    <>
      <button type="button" className="text-danger hover:underline" onClick={showModal}>
        {children}
      </button>
      <DeleteServerModal server={server} open={isModalOpen} onClose={onClose} />
    </>
  );
};
