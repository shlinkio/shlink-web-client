import { faCopy as copyIcon } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNil } from 'ramda';
import React, { useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Card, CardBody, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import { createShortUrlResultType } from '../reducers/shortUrlCreation';
import './CreateShortUrlResult.scss';

const propTypes = {
  resetCreateShortUrl: PropTypes.func,
  error: PropTypes.bool,
  result: createShortUrlResultType,
};

const CreateShortUrlResult = (useStateFlagTimeout) => {
  const CreateShortUrlResultComp = ({ error, result, resetCreateShortUrl }) => {
    const [ showCopyTooltip, setShowCopyTooltip ] = useStateFlagTimeout();

    useEffect(() => {
      resetCreateShortUrl();
    }, []);

    if (error) {
      return (
        <Card body color="danger" inverse className="bg-danger mt-3">
          An error occurred while creating the URL :(
        </Card>
      );
    }

    if (isNil(result)) {
      return null;
    }

    const { shortUrl } = result;

    return (
      <Card inverse className="bg-main mt-3">
        <CardBody>
          <b>Great!</b> The short URL is <b>{shortUrl}</b>

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
        </CardBody>
      </Card>
    );
  };

  CreateShortUrlResultComp.propTypes = propTypes;

  return CreateShortUrlResultComp;
};

export default CreateShortUrlResult;
