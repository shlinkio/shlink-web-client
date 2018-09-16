import copyIcon from '@fortawesome/fontawesome-free-regular/faCopy';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { isNil } from 'ramda';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Card, CardBody, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import { createShortUrlResultType } from '../reducers/shortUrlCreation';
import { stateFlagTimeout } from '../../utils/utils';
import './CreateShortUrlResult.scss';

export default class CreateShortUrlResult extends React.Component {
  static propTypes = {
    resetCreateShortUrl: PropTypes.func,
    error: PropTypes.bool,
    result: createShortUrlResultType,
  };

  state = { showCopyTooltip: false };

  componentDidMount() {
    this.props.resetCreateShortUrl();
  }

  render() {
    const { error, result } = this.props;

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
    const onCopy = () => stateFlagTimeout(this.setState.bind(this), 'showCopyTooltip');

    return (
      <Card inverse className="bg-main mt-3">
        <CardBody>
          <b>Great!</b> The short URL is <b>{shortUrl}</b>

          <CopyToClipboard text={shortUrl} onCopy={onCopy}>
            <button
              className="btn btn-light btn-sm create-short-url-result__copy-btn"
              id="copyBtn"
              type="button"
            >
              <FontAwesomeIcon icon={copyIcon} /> Copy
            </button>
          </CopyToClipboard>

          <Tooltip placement="left" isOpen={this.state.showCopyTooltip} target="copyBtn">
            Copied!
          </Tooltip>
        </CardBody>
      </Card>
    );
  }
}
