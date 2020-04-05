import React from 'react';
import { faMinusCircle as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useToggle } from '../utils/helpers/hooks';
import { serverType } from './prop-types';

const propTypes = {
  server: serverType,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  children: PropTypes.node,
};

const DeleteServerButton = (DeleteServerModal) => {
  const DeleteServerButtonComp = ({ server, className, children, textClassName }) => {
    const [ isModalOpen, , showModal, hideModal ] = useToggle();

    return (
      <React.Fragment>
        <span className={className} onClick={showModal}>
          {!children && <FontAwesomeIcon icon={deleteIcon} />}
          <span className={textClassName}>{children || 'Remove this server'}</span>
        </span>

        <DeleteServerModal server={server} isOpen={isModalOpen} toggle={hideModal} />
      </React.Fragment>
    );
  };

  DeleteServerButtonComp.propTypes = propTypes;

  return DeleteServerButtonComp;
};

export default DeleteServerButton;
