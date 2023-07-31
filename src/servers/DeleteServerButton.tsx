import { faMinusCircle as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, PropsWithChildren } from 'react';
import { useToggle } from '../../shlink-frontend-kit/src';
import type { ServerWithId } from './data';
import type { DeleteServerModalProps } from './DeleteServerModal';

export type DeleteServerButtonProps = PropsWithChildren<{
  server: ServerWithId;
  className?: string;
  textClassName?: string;
}>;

export const DeleteServerButton = (DeleteServerModal: FC<DeleteServerModalProps>): FC<DeleteServerButtonProps> => (
  { server, className, children, textClassName },
) => {
  const [isModalOpen, , showModal, hideModal] = useToggle();

  return (
    <>
      <span className={className} onClick={showModal}>
        {!children && <FontAwesomeIcon fixedWidth icon={deleteIcon} />}
        <span className={textClassName}>{children ?? 'Remove this server'}</span>
      </span>

      <DeleteServerModal server={server} isOpen={isModalOpen} toggle={hideModal} />
    </>
  );
};
