import React, { useState } from 'react';
import { faMinusCircle as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { serverType } from './prop-types';

const propTypes = {
  server: serverType,
  className: PropTypes.string,
};

const DeleteServerButton = (DeleteServerModal, ShlinkVersions) => {
  const DeleteServerButtonComp = ({ server, className }) => {
    const [ isModalOpen, setModalOpen ] = useState(false);

    return (
      <React.Fragment>
        <span className={className} key="deleteServerBtn" onClick={() => setModalOpen(true)}>
          <FontAwesomeIcon icon={deleteIcon} />
          <span className="aside-menu__item-text">Remove this server</span>
        </span>

        <ShlinkVersions className="mt-2 pl-2" />

        <DeleteServerModal
          isOpen={isModalOpen}
          toggle={() => setModalOpen(!isModalOpen)}
          server={server}
          key="deleteServerModal"
        />
      </React.Fragment>
    );
  };

  DeleteServerButtonComp.propTypes = propTypes;

  return DeleteServerButtonComp;
};

export default DeleteServerButton;
