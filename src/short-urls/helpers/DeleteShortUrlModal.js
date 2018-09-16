import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { shortUrlType } from '../reducers/shortUrlsList';
import './QrCodeModal.scss';

export default class DeleteShortUrlModal extends Component {
  static propTypes = {
    shortUrl: shortUrlType,
    toggle: PropTypes.func,
    isOpen: PropTypes.bool,
  };

  state = { inputValue: '' };

  render() {
    const { shortUrl, toggle, isOpen } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <form onSubmit={(e) => e.preventDefault()}>
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
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-link" onClick={toggle}>Cancel</button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={this.state.inputValue !== shortUrl.shortCode}
              onClick={toggle}
            >
              Delete
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}
