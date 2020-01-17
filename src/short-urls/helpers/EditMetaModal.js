import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import moment from 'moment';
import { shortUrlType } from '../reducers/shortUrlsList';
import { shortUrlEditMetaType } from '../reducers/shortUrlMeta';
import DateInput from '../../utils/DateInput';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  shortUrl: shortUrlType.isRequired,
  shortUrlMeta: shortUrlEditMetaType,
  editShortUrlMeta: PropTypes.func,
  shortUrlMetaEdited: PropTypes.func,
  resetShortUrlMeta: PropTypes.func,
};

const dateOrUndefined = (shortUrl, dateName) => {
  const date = shortUrl && shortUrl.meta && shortUrl.meta[dateName];

  return date && moment(date);
};

const EditMetaModal = (
  { isOpen, toggle, shortUrl, shortUrlMeta, editShortUrlMeta, shortUrlMetaEdited, resetShortUrlMeta }
) => {
  const { saving, error } = editShortUrlMeta;
  const url = shortUrl && (shortUrl.shortUrl || '');
  const validSince = dateOrUndefined(shortUrl, 'validSince');
  const validUntil = dateOrUndefined(shortUrl, 'validUntil');

  console.log(shortUrlMeta, shortUrlMetaEdited, resetShortUrlMeta, useEffect, useState);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Edit metadata for <ExternalLink href={url} />
      </ModalHeader>
      <form>
        <ModalBody>
          <FormGroup>
            <DateInput
              placeholderText="Enabled since..."
              selected={validSince}
              maxDate={validUntil}
              isClearable
            />
          </FormGroup>
          <FormGroup>
            <DateInput
              placeholderText="Enabled until..."
              selected={validUntil}
              minDate={validSince}
              isClearable
            />
          </FormGroup>
          <FormGroup className="mb-0">
            <Input type="number" placeholder="Maximum number of visits allowed" />
          </FormGroup>
          {error && (
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while saving the metadata :(
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" type="button" onClick={toggle}>Cancel</button>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

EditMetaModal.propTypes = propTypes;

export default EditMetaModal;
