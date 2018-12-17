import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { identity } from 'ramda';
import { shortUrlType } from '../reducers/shortUrlsList';
import { shortUrlDeletionType } from '../reducers/shortUrlDeletion';

export default class DeleteShortUrlModal extends React.Component {
  static propTypes = {
    shortUrl: shortUrlType,
    toggle: PropTypes.func,
    isOpen: PropTypes.bool,
    shortUrlDeletion: shortUrlDeletionType,
    deleteShortUrl: PropTypes.func,
    resetDeleteShortUrl: PropTypes.func,
    shortUrlDeleted: PropTypes.func,
  };

  state = { inputValue: '' };
  handleDeleteUrl = (e) => {
    e.preventDefault();

    const { deleteShortUrl, shortUrl, toggle, shortUrlDeleted } = this.props;
    const { shortCode } = shortUrl;

    deleteShortUrl(shortCode)
      .then(() => {
        shortUrlDeleted(shortCode);
        toggle();
      })
      .catch(identity);
  };

  componentWillUnmount() {
    const { resetDeleteShortUrl } = this.props;

    resetDeleteShortUrl();
  }

  render() {
    const { shortUrl, toggle, isOpen, shortUrlDeletion } = this.props;
    const THRESHOLD_REACHED = 'INVALID_SHORTCODE_DELETION';
    const hasThresholdError = shortUrlDeletion.error && shortUrlDeletion.errorData.error === THRESHOLD_REACHED;
    const hasErrorOtherThanThreshold = shortUrlDeletion.error && shortUrlDeletion.errorData.error !== THRESHOLD_REACHED;

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <form onSubmit={this.handleDeleteUrl}>
          <ModalHeader toggle={toggle}>
            <span className="text-danger">Delete short URL</span>
          </ModalHeader>
          <ModalBody>
            <p><b className="text-danger">Caution!</b> You are about to delete a short URL.</p>
            <p>This action cannot be undone. Once you have deleted it, all the visits stats will be lost.</p>

            <input
              type="text"
              className="form-control"
              placeholder="Insert the short code of the URL"
              value={this.state.inputValue}
              onChange={(e) => this.setState({ inputValue: e.target.value })}
            />

            {hasThresholdError && (
              <div className="p-2 mt-2 bg-warning text-center">
                This short URL has received too many visits and therefore, it cannot be deleted
              </div>
            )}
            {hasErrorOtherThanThreshold && (
              <div className="p-2 mt-2 bg-danger text-white text-center">
                Something went wrong while deleting the URL :(
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-link" onClick={toggle}>Cancel</button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={this.state.inputValue !== shortUrl.shortCode || shortUrlDeletion.loading}
            >
              {shortUrlDeletion.loading ? 'Deleting...' : 'Delete'}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}
