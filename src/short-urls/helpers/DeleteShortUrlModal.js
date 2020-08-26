import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { identity, pipe } from 'ramda';
import { shortUrlType } from '../reducers/shortUrlsList';
import { shortUrlDeletionType } from '../reducers/shortUrlDeletion';

const THRESHOLD_REACHED = 'INVALID_SHORTCODE_DELETION';

const propTypes = {
  shortUrl: shortUrlType,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  shortUrlDeletion: shortUrlDeletionType,
  deleteShortUrl: PropTypes.func,
  resetDeleteShortUrl: PropTypes.func,
};

const DeleteShortUrlModal = ({ shortUrl, toggle, isOpen, shortUrlDeletion, resetDeleteShortUrl, deleteShortUrl }) => {
  const [ inputValue, setInputValue ] = useState('');

  useEffect(() => resetDeleteShortUrl, []);

  const { error, errorData } = shortUrlDeletion;
  const errorCode = error && errorData && (errorData.type || errorData.error);
  const hasThresholdError = errorCode === THRESHOLD_REACHED;
  const hasErrorOtherThanThreshold = error && errorCode !== THRESHOLD_REACHED;
  const close = pipe(resetDeleteShortUrl, toggle);
  const handleDeleteUrl = (e) => {
    e.preventDefault();

    const { shortCode, domain } = shortUrl;

    deleteShortUrl(shortCode, domain)
      .then(toggle)
      .catch(identity);
  };

  return (
    <Modal isOpen={isOpen} toggle={close} centered>
      <form onSubmit={handleDeleteUrl}>
        <ModalHeader toggle={close}>
          <span className="text-danger">Delete short URL</span>
        </ModalHeader>
        <ModalBody>
          <p><b className="text-danger">Caution!</b> You are about to delete a short URL.</p>
          <p>This action cannot be undone. Once you have deleted it, all the visits stats will be lost.</p>

          <input
            type="text"
            className="form-control"
            placeholder="Insert the short code of the URL"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {hasThresholdError && (
            <div className="p-2 mt-2 bg-warning text-center">
              {errorData.threshold && `This short URL has received more than ${errorData.threshold} visits, and therefore, it cannot be deleted.`}
              {!errorData.threshold && 'This short URL has received too many visits, and therefore, it cannot be deleted.'}
            </div>
          )}
          {hasErrorOtherThanThreshold && (
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while deleting the URL :(
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-link" onClick={close}>Cancel</button>
          <button
            type="submit"
            className="btn btn-danger"
            disabled={inputValue !== shortUrl.shortCode || shortUrlDeletion.loading}
          >
            {shortUrlDeletion.loading ? 'Deleting...' : 'Delete'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

DeleteShortUrlModal.propTypes = propTypes;

export default DeleteShortUrlModal;
