import { faCopy as copyIcon } from '@fortawesome/free-regular-svg-icons';
import { faTimes as closeIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNil } from 'ramda';
import { useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Tooltip } from 'reactstrap';
import { ShortUrlCreation } from '../reducers/shortUrlCreation';
import { TimeoutToggle } from '../../utils/helpers/hooks';
import { Result } from '../../utils/Result';
import './CreateShortUrlResult.scss';
import { ShlinkApiError } from '../../api/ShlinkApiError';

export interface CreateShortUrlResultProps extends ShortUrlCreation {
  resetCreateShortUrl: () => void;
  canBeClosed?: boolean;
}

export const CreateShortUrlResult = (useTimeoutToggle: TimeoutToggle) => (
  { error, errorData, result, resetCreateShortUrl, canBeClosed = false }: CreateShortUrlResultProps,
) => {
  const [showCopyTooltip, setShowCopyTooltip] = useTimeoutToggle();

  useEffect(() => {
    resetCreateShortUrl();
  }, []);

  if (error) {
    return (
      <Result type="error" className="mt-3">
        {canBeClosed && <FontAwesomeIcon icon={closeIcon} className="float-end pointer" onClick={resetCreateShortUrl} />}
        <ShlinkApiError errorData={errorData} fallbackMessage="An error occurred while creating the URL :(" />
      </Result>
    );
  }

  if (isNil(result)) {
    return null;
  }

  const { shortUrl } = result;

  return (
    <Result type="success" className="mt-3">
      {canBeClosed && <FontAwesomeIcon icon={closeIcon} className="float-end pointer" onClick={resetCreateShortUrl} />}
      <span><b>Great!</b> The short URL is <b>{shortUrl}</b></span>

      <CopyToClipboard text={shortUrl} onCopy={setShowCopyTooltip}>
        <button
          className="btn btn-light btn-sm create-short-url-result__copy-btn"
          id="copyBtn"
          type="button"
        >
          <FontAwesomeIcon icon={copyIcon} /> Copy
        </button>
      </CopyToClipboard>

      <Tooltip placement="left" isOpen={showCopyTooltip} target="copyBtn">
        Copied!
      </Tooltip>
    </Result>
  );
};
