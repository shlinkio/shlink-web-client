import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { identity, pipe } from 'ramda';
import { ShortUrlDeletion } from '../reducers/shortUrlDeletion';
import { ShortUrlModalProps } from '../data';
import { handleEventPreventingDefault, OptionalString } from '../../utils/utils';
import { Result } from '../../utils/Result';

const THRESHOLD_REACHED = 'INVALID_SHORTCODE_DELETION';

interface DeleteShortUrlModalConnectProps extends ShortUrlModalProps {
  shortUrlDeletion: ShortUrlDeletion;
  deleteShortUrl: (shortCode: string, domain: OptionalString) => Promise<void>;
  resetDeleteShortUrl: () => void;
}

const DeleteShortUrlModal = (
  { shortUrl, toggle, isOpen, shortUrlDeletion, resetDeleteShortUrl, deleteShortUrl }: DeleteShortUrlModalConnectProps,
) => {
  const [ inputValue, setInputValue ] = useState('');

  useEffect(() => resetDeleteShortUrl, []);

  const { error, errorData } = shortUrlDeletion;
  const errorCode = error && errorData?.type;
  const hasThresholdError = errorCode === THRESHOLD_REACHED;
  const hasErrorOtherThanThreshold = error && errorCode !== THRESHOLD_REACHED;
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

          {hasThresholdError && (
            <Result type="warning" textCentered small className="mt-2">
              {errorData?.threshold && `This short URL has received more than ${errorData.threshold} visits, and therefore, it cannot be deleted.`}
              {!errorData?.threshold && 'This short URL has received too many visits, and therefore, it cannot be deleted.'}
            </Result>
          )}
          {hasErrorOtherThanThreshold && (
            <Result type="error" textCentered small className="mt-2">
              Something went wrong while deleting the URL :(
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
