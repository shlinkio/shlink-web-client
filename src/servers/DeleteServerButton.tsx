import React, { FC } from 'react';
import { faMinusCircle as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '../utils/helpers/hooks';
import { DeleteServerModalProps } from './DeleteServerModal';
import { ServerWithId } from './data';

export interface DeleteServerButtonProps {
  server: ServerWithId;
  className?: string;
  textClassName?: string;
}

const DeleteServerButton = (DeleteServerModal: FC<DeleteServerModalProps>): FC<DeleteServerButtonProps> => (
  { server, className, children, textClassName },
) => {
  const [ isModalOpen, , showModal, hideModal ] = useToggle();

  return (
    <React.Fragment>
      <span className={className} onClick={showModal}>
        {!children && <FontAwesomeIcon icon={deleteIcon} />}
        <span className={textClassName}>{children ?? 'Remove this server'}</span>
      </span>

      <DeleteServerModal server={server} isOpen={isModalOpen} toggle={hideModal} />
    </React.Fragment>
  );
};

export default DeleteServerButton;
