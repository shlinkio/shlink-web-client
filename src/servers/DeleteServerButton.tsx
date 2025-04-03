import { faMinusCircle as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '@shlinkio/shlink-frontend-kit';
import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import type { ServerWithId } from './data';
import type { DeleteServerModalProps } from './DeleteServerModal';

export type DeleteServerButtonProps = PropsWithChildren<{
  server: ServerWithId;
  className?: string;
  textClassName?: string;
}>;

type DeleteServerButtonDeps = {
  DeleteServerModal: FC<DeleteServerModalProps>;
};

const DeleteServerButton: FCWithDeps<DeleteServerButtonProps, DeleteServerButtonDeps> = (
  { server, className, children, textClassName },
) => {
  const { DeleteServerModal } = useDependencies(DeleteServerButton);
  const [isModalOpen, , showModal, hideModal] = useToggle();
  const navigate = useNavigate();
  const onClose = useCallback((confirmed: boolean) => {
    hideModal();
    if (confirmed) {
      navigate('/');
    }
  }, [hideModal, navigate]);

  return (
    <>
      <button type="button" className={clsx(className, 'p-0 bg-transparent border-0')} onClick={showModal}>
        {!children && <FontAwesomeIcon fixedWidth icon={deleteIcon} />}
        <span className={textClassName}>{children ?? 'Remove this server'}</span>
      </button>

      <DeleteServerModal server={server} open={isModalOpen} onClose={onClose} />
    </>
  );
};

export const DeleteServerButtonFactory = componentFactory(DeleteServerButton, ['DeleteServerModal']);
