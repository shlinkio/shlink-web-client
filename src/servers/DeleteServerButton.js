import React, { useState } from 'react';
import { faMinusCircle as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { serverType } from './prop-types';

const propTypes = {
  server: serverType,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  children: PropTypes.node,
};

const DeleteServerButton = (DeleteServerModal) => {
  const DeleteServerButtonComp = ({ server, className, children, textClassName }) => {
    const [ isModalOpen, setModalOpen ] = useState(false);

    return (
      <React.Fragment>
        <span className={className} onClick={() => setModalOpen(true)}>
          {!children && <FontAwesomeIcon icon={deleteIcon} />}
          <span className={textClassName}>{children || 'Remove this server'}</span>
        </span>

        <DeleteServerModal server={server} isOpen={isModalOpen} toggle={() => setModalOpen(!isModalOpen)} />
      </React.Fragment>
    );
  };

  DeleteServerButtonComp.propTypes = propTypes;

  return DeleteServerButtonComp;
};

export default DeleteServerButton;
