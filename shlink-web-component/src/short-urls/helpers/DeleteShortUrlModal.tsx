import { pipe } from 'ramda';
import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Result } from '../../../../shlink-frontend-kit/src';
import { isInvalidDeletionError } from '../../api-contract/utils';
import { ShlinkApiError } from '../../common/ShlinkApiError';
import { handleEventPreventingDefault } from '../../utils/helpers';
import type { ShortUrlIdentifier, ShortUrlModalProps } from '../data';
import type { ShortUrlDeletion } from '../reducers/shortUrlDeletion';

interface DeleteShortUrlModalConnectProps extends ShortUrlModalProps {
  shortUrlDeletion: ShortUrlDeletion;
  deleteShortUrl: (shortUrl: ShortUrlIdentifier) => Promise<void>;
  shortUrlDeleted: (shortUrl: ShortUrlIdentifier) => void;
  resetDeleteShortUrl: () => void;
}

const DELETION_PATTERN = 'delete';

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
          <p>Write <b>{DELETION_PATTERN}</b> to confirm deletion.</p>

          <input
            type="text"
            className="form-control"
            placeholder={`Insert ${DELETION_PATTERN}`}
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
            disabled={inputValue !== DELETION_PATTERN || loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
