import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { pipe } from 'ramda';
import { ShortUrlDeletion } from '../reducers/shortUrlDeletion';
import { ShortUrlIdentifier, ShortUrlModalProps } from '../data';
import { handleEventPreventingDefault } from '../../utils/utils';
import { Result } from '../../utils/Result';
import { isInvalidDeletionError } from '../../api/utils';
import { ShlinkApiError } from '../../api/ShlinkApiError';

interface DeleteShortUrlModalConnectProps extends ShortUrlModalProps {
  shortUrlDeletion: ShortUrlDeletion;
  deleteShortUrl: (shortUrl: ShortUrlIdentifier) => Promise<void>;
  shortUrlDeleted: (shortUrl: ShortUrlIdentifier) => void;
  resetDeleteShortUrl: () => void;
}

export const DeleteShortUrlModal = ({
  shortUrl,
  toggle,
  isOpen,
  shortUrlDeletion,
  resetDeleteShortUrl,
  deleteShortUrl,
  shortUrlDeleted,
}: DeleteShortUrlModalConnectProps) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => resetDeleteShortUrl, []);

  const { loading, error, deleted, errorData } = shortUrlDeletion;
  const close = pipe(resetDeleteShortUrl, toggle);
  const handleDeleteUrl = handleEventPreventingDefault(() => deleteShortUrl(shortUrl).then(toggle));

  return (
    <Modal isOpen={isOpen} toggle={close} centered onClosed={() => deleted && shortUrlDeleted(shortUrl)}>
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
            disabled={inputValue !== shortUrl.shortCode || loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
