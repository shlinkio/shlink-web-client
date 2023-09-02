import { faMinusCircle as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '@shlinkio/shlink-frontend-kit';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
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
      <button type="button" className={classNames(className, 'p-0 bg-transparent border-0')} onClick={showModal}>
        {!children && <FontAwesomeIcon fixedWidth icon={deleteIcon} />}
        <span className={textClassName}>{children ?? 'Remove this server'}</span>
      </button>

      <DeleteServerModal server={server} isOpen={isModalOpen} toggle={hideModal} />
    </>
  );
};
