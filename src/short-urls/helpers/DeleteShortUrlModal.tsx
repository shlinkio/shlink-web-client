import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { identity, pipe } from 'ramda';
import { ShortUrlDeletion } from '../reducers/shortUrlDeletion';
import { ShortUrlModalProps } from '../data';
import { handleEventPreventingDefault, OptionalString } from '../../utils/utils';
import { Result } from '../../utils/Result';
import { isInvalidDeletionError } from '../../api/utils';
import { ShlinkApiError } from '../../api/ShlinkApiError';

interface DeleteShortUrlModalConnectProps extends ShortUrlModalProps {
  shortUrlDeletion: ShortUrlDeletion;
  deleteShortUrl: (shortCode: string, domain: OptionalString) => Promise<void>;
  resetDeleteShortUrl: () => void;
}

const DeleteShortUrlModal = (
  { shortUrl, toggle, isOpen, shortUrlDeletion, resetDeleteShortUrl, deleteShortUrl }: DeleteShortUrlModalConnectProps,
) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => resetDeleteShortUrl, []);

  const { error, errorData } = shortUrlDeletion;
  const close = pipe(resetDeleteShortUrl, toggle);
  const handleDeleteUrl = handleEventPreventingDefault(() => {
    const { shortCode, domain } = shortUrl;

    deleteShortUrl(shortCode, domain)
      .then(toggle)
      .catch(identity);
  });

  return (
    <Modal isOpen={isOpen} toggle={close} centered>
      <form onSubmit={handleDeleteUrl}>
        <ModalHeader toggle={close}>
          <span className="text-danger">Delete short URL</span>
        </ModalHeader>
        <ModalBody>
          <p><b className="text-danger">Caution!</b> You are about to delete a short URL.</p>
          <p>This action cannot be undone. Once you have deleted it, all the visits stats will be lost.</p>
          <p>Write <b>{shortUrl.shortCode}</b> to confirm deletion.</p>

          <input
            type="text"
            className="form-control"
            placeholder={`Insert the short code (${shortUrl.shortCode})`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {error && (
            <Result type={isInvalidDeletionError(errorData) ? 'warning' : 'error'} small className="mt-2">
              <ShlinkApiError errorData={errorData} fallbackMessage="Something went wrong while deleting the URL :(" />
            </Result>
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

export default DeleteShortUrlModal;
