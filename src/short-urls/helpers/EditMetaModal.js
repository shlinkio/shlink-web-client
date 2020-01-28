import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { ExternalLink } from 'react-external-link';
import moment from 'moment';
import { isEmpty, pipe } from 'ramda';
import { shortUrlType } from '../reducers/shortUrlsList';
import { shortUrlEditMetaType } from '../reducers/shortUrlMeta';
import DateInput from '../../utils/DateInput';
import { formatIsoDate } from '../../utils/utils';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  shortUrl: shortUrlType.isRequired,
  shortUrlMeta: shortUrlEditMetaType,
  editShortUrlMeta: PropTypes.func,
  resetShortUrlMeta: PropTypes.func,
};

const dateOrUndefined = (shortUrl, dateName) => {
  const date = shortUrl && shortUrl.meta && shortUrl.meta[dateName];

  return date && moment(date);
};

const EditMetaModal = (
  { isOpen, toggle, shortUrl, shortUrlMeta, editShortUrlMeta, resetShortUrlMeta }
) => {
  const { saving, error } = shortUrlMeta;
  const url = shortUrl && (shortUrl.shortUrl || '');
  const [ validSince, setValidSince ] = useState(dateOrUndefined(shortUrl, 'validSince'));
  const [ validUntil, setValidUntil ] = useState(dateOrUndefined(shortUrl, 'validUntil'));
  const [ maxVisits, setMaxVisits ] = useState(shortUrl && shortUrl.meta && shortUrl.meta.maxVisits);

  const close = pipe(resetShortUrlMeta, toggle);
  const doEdit = () => editShortUrlMeta(shortUrl.shortCode, {
    maxVisits: maxVisits && !isEmpty(maxVisits) ? parseInt(maxVisits) : null,
    validSince: validSince && formatIsoDate(validSince),
    validUntil: validUntil && formatIsoDate(validUntil),
  }).then(close);

  return (
    <Modal isOpen={isOpen} toggle={close} centered>
      <ModalHeader toggle={close}>
        <FontAwesomeIcon icon={infoIcon} id="metaTitleInfo" /> Edit metadata for <ExternalLink href={url} />
        <UncontrolledTooltip target="metaTitleInfo" placement="bottom">
          <p>Using these metadata properties, you can limit when and how many times your short URL can be visited.</p>
          <p>If any of the params is not met, the URL will behave as if it was an invalid short URL.</p>
        </UncontrolledTooltip>
      </ModalHeader>
      <form onSubmit={(e) => e.preventDefault() || doEdit()}>
        <ModalBody>
          <FormGroup>
            <DateInput
              placeholderText="Enabled since..."
              selected={validSince}
              maxDate={validUntil}
              isClearable
              onChange={setValidSince}
            />
          </FormGroup>
          <FormGroup>
            <DateInput
              placeholderText="Enabled until..."
              selected={validUntil}
              minDate={validSince}
              isClearable
              onChange={setValidUntil}
            />
          </FormGroup>
          <FormGroup className="mb-0">
            <Input
              type="number"
              placeholder="Maximum number of visits allowed"
              min={1}
              value={maxVisits || ''}
              onChange={(e) => setMaxVisits(e.target.value)}
            />
          </FormGroup>
          {error && (
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while saving the metadata :(
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" type="button" onClick={close}>Cancel</button>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

EditMetaModal.propTypes = propTypes;

export default EditMetaModal;
